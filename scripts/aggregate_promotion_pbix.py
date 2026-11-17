"""Rebuild public/data/promotion-dashboard.json from the Power BI file.

Reads the .pbix data model with pbixray, joins Fact Sales to its dimensions, and
sums sales/return quantities and amounts by year x workday x state x product
subcategory x promotion. The website recomputes the DAX measures from these sums.

Usage (in a virtual environment with `pip install pbixray`):
    python scripts/aggregate_promotion_pbix.py "<path to .pbix>" public/data/promotion-dashboard.json
"""
import sys, json, gzip, pandas as pd
from pbixray import PBIXRay
src, out = sys.argv[1], sys.argv[2]
m=PBIXRay(src)
f=m.get_table('Fact Sales')
d=m.get_table('Dim Date'); g=m.get_table('Dim Geography'); p=m.get_table('Dim Product Master'); pr=m.get_table('Dim Promotion')
for c in ['SalesAmount','ReturnAmount','TotalCost']: f[c]=pd.to_numeric(f[c].astype(str)).astype(float)
for c in ['SalesQuantity','ReturnQuantity']: f[c]=f[c].astype('int64')
d['Date']=pd.to_datetime(d['Date'])
f=f.merge(d[['Date','Year','Is Workday?']],left_on='Date Key',right_on='Date',how='left')
f=f.merge(g[['Geography Key','Continent','Region / Country','State / Province']],on='Geography Key',how='left')
f=f.merge(p[['Product Key','Product Category','Product Sub Category']],on='Product Key',how='left')
f=f.merge(pr[['Promotion Key','Promotion','Discount Percent']],on='Promotion Key',how='left')
print("unmatched:", {c:int(f[c].isna().sum()) for c in ['Year','Continent','Product Category','Promotion']})
# Totals for verification against Power BI cards
tot=dict(salesQty=int(f.SalesQuantity.sum()), returnQty=int(f.ReturnQuantity.sum()), sales=f.SalesAmount.sum(), returns=f.ReturnAmount.sum(), cost=f.TotalCost.sum())
tot['netProfit']=tot['sales']-tot['returns']-tot['cost']; print("TOTALS", tot)
keys=['Year','Is Workday?','Continent','Region / Country','State / Province','Product Category','Product Sub Category','Promotion']
a=f.groupby(keys,dropna=False,observed=True).agg(sq=('SalesQuantity','sum'),rq=('ReturnQuantity','sum'),sa=('SalesAmount','sum'),ra=('ReturnAmount','sum'),co=('TotalCost','sum')).reset_index()
print("rows", len(a))
# dimension dictionaries
geo=a[['Continent','Region / Country','State / Province']].drop_duplicates().sort_values(['Continent','Region / Country','State / Province']).reset_index(drop=True)
prod=a[['Product Category','Product Sub Category']].drop_duplicates().sort_values(['Product Category','Product Sub Category']).reset_index(drop=True)
promos=sorted(a['Promotion'].unique(), key=lambda x:(x!='No Discount',x))
gi={tuple(r):i for i,r in enumerate(geo.itertuples(index=False))}
pi={tuple(r):i for i,r in enumerate(prod.itertuples(index=False))}
mi={v:i for i,v in enumerate(promos)}
years=sorted(a.Year.unique().tolist())
rows=[[years.index(r.Year), 1 if r[2]=='WorkDay' else 0, gi[(r[3],r[4],r[5])], pi[(r[6],r[7])], mi[r[8]], int(r.sq), int(r.rq), round(r.sa), round(r.ra), round(r.co)] for r in a.itertuples()]
days=d.groupby(['Year','Is Workday?']).size()
dayCounts={str(y):{"workday":int(days.get((y,'WorkDay'),0)),"weekend":int(days.get((y,'WeekEnd'),0))} for y in years}
disc=pr.groupby('Promotion')['Discount Percent'].max().to_dict()
data={"source":"Contoso sample data (Microsoft), aggregated from the Power BI model","years":years,"dayCounts":dayCounts,
 "geo":geo.values.tolist(),"products":prod.values.tolist(),
 "promotions":[{"name":x,"discount":float(disc.get(x,0))} for x in promos],
 "fields":["year","workday","geo","product","promotion","salesQty","returnQty","salesAmount","returnAmount","cost"],
 "rows":rows}
s=json.dumps(data,separators=(',',':'))
open(out,'w').write(s)
print("json bytes", len(s), "gzip", len(gzip.compress(s.encode())))
