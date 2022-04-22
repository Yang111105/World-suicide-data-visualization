
# Suicide-data-Visualization

# Objective

Suicide Data Visualization Death by suicide is sensitive topic that causes pain to hundreds of thousands of people every year around the world. There is a need for it to be investigated in order to learn from it and possibly prevent it. According to estimates from the World Health Organization (WHO), Suicide is the second leading cause of death among 15-29 years old and over 800,000 people die because of it every year. These large numbers motivated us to work on this topic. We found that the data is workable and not too complex to pick apart.

# Links

Dataset: https://www.kaggle.com/russellyates88/suicide-rates-overview-1985-to-2016?select=master.csv datasize: 2.71MB https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson

# Project Content
The project contains a website with several views of the data. 
1.  Suicide Chloropleth Map to control the dashboard by year and country with handle clicks which changes all views. The views include a bubble chart for Suicides by Age, and pie charts for Gender and Generation for selected Country/Year

2. A trend line chart page 

3. The individual plot pages contain detailed by Age, Gender, Generation and Country

4. The project utilizes a Flask server to pull data from  PostgresSQL database and generate API endpoints to return the information to the website. The JavaScript library that we did not cover in class was JQuery, which helped create our Bubble Chart.

FILES INCLUDED IN THE REPO: 2 JUPYTER NOTEBOOKS - ETL (FOR DATA TRANSFORMATION AND GENERATING DATABASE), GEOJSON MODIFICATION- GENERATE GEOJSON THAT FEEDS INFO TO THE MAP, Query.sql to assign primary key to table, APP.PY - RETURN FLASK SERVER TO RETURN THE VIEWS, TEMPLATE FOLDER- 5 HTMLS- to make each page, JSon Files- 8 to generate content in the web for each webpage, and CSS- file for styling

# Instruction to recreate the project:

1. Open PgAdmin as a management tool for PostgreSQL. Create `congfig.py` to include username and password. Create a new database entitled `suicide_db`.

2. Activate PythonData38. Launch Jupyter notebook. Run file `ETL.ipynb`.

3. Run `query.sql` in PgAdmin. Verify the tables. '`suicidedata` and `countrydata`

4. Run `modify_geojson.ipynb` 

    4a) Reduce the geojson file by using mapshaper.org. Name the reduced file `country_15years_reduced.json` 

5. Activate Pythondata38. Run Python `app.py`. 

6. Open browser and type the Flask (port name) server name to view the site.


## **To run the the dashboard properly, you must first enter the year, then click which country you would like the data from.



