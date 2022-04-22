import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template
import itertools
from operator import itemgetter
import json 

#################################################
# Database Setup
#################################################
engine = create_engine("postgresql://postgres:bootcamp@localhost:5432/suicide_db")

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

 # Save reference to the table
Suicide = Base.classes.suicidedata

@app.route("/")
def index():
    #"""Return the homepage."""
    return render_template("index.html")

@app.route("/gender")
def gender():
    #"""Return the homepage."""
    return render_template("gender.html")

@app.route("/generation")
def generation():
    #"""Return the homepage."""
    return render_template("generation.html")

@app.route("/byCountry")
def byCountry():
    #"""Return the homepage."""
    return render_template("byCountry.html")

@app.route("/byAge")
def byAge():
    #"""Return the homepage."""
    return render_template("byAge.html")

@app.route("/map")
def map():
    #"""Return the homepage."""
    return render_template("map.html")


@app.route("/api/suicides_by_country")
def suicides_by_country():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT c.iso_abr, s.country, s.suicides FROM countrydata c JOIN (SELECT country, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY country) s ON c.name = s.country;")
    print(results)
    output = {}
    for result in results:
        output[result['iso_abr']] = {
            'suicides': int(result['suicides']),
            'iso_abr': result['iso_abr'],
            'country': result['country']
        }
    session.close()
    return jsonify(output)

@app.route("/api/suicides_by_gender")
def suicides_by_gender():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    results = engine.execute("SELECT sex, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY sex")
    
    output = {}
    for result in results:
        output[result['sex']] = int(result['suicides'])
    session.close()
    return jsonify(output)

@app.route("/api/yearly_suicides_by_gender_country")
def yearly_suicides_by_gender_country():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    results = engine.execute("SELECT country, iso_abr, year, sex, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY country, iso_abr, year,sex;")
    
    output = []
    for result in results:
        output.append({
            'country': result['country'],
            'iso_abr':result['iso_abr'],
            'year': result['year'],
            'sex': result['sex'],
            'suicides': int(result['suicides'])
        })
    session.close()

    yearly_results = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('year'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['year']):
        yearly_results[key] = list(group)
    return jsonify(yearly_results)

@app.route("/api/yearly_suicides_by_gender")
def yearly_suicides_by_gender():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    
    results = engine.execute("SELECT year, sex, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY year,sex;")
    
    output = []
    for result in results:
        output.append({
            'year': result['year'],
            'sex': result['sex'],
            'suicides': int(result['suicides'])
        })
    session.close()

    yearly_results = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('year'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['year']):
        yearly_results[key] = list(group)
    return jsonify(yearly_results)

@app.route("/api/yearly_suicides_by_generation_country")
def yearly_suicides_by_generation_test():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT country, iso_abr, generation,year, sum(suicides_no) as numsuicides FROM suicidedata GROUP BY country, iso_abr, year, generation order by year")
    output = []
    for result in results:
        output.append({
            'country': result['country'],
            'iso_abr':result['iso_abr'],
            'year': result['year'],
            'generation': result['generation'],
            'numsuicides': int(result['numsuicides'])
        })
    session.close()
    yearly_results = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('year'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['year']):
        yearly_results[key] = list(group)
    return jsonify(yearly_results)

@app.route("/api/suicides_by_generation")
def suicides_by_generation():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT generation, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY generation ORDER BY suicides DESC")
    
    output = {}
    for result in results:
        output[result['generation']] = int(result['suicides'])
    session.close()
    return jsonify(output)

@app.route("/api/yearly_suicides_by_generation")
def yearly_suicides_by_generation():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT generation,year, sum(suicides_no) as numsuicides FROM suicidedata GROUP BY year, generation order by year")
    output = []
    for result in results:
        output.append({
            'year': result['year'],
            'generation': result['generation'],
            'numsuicides': int(result['numsuicides'])
        })
    session.close()
    yearly_results = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('year'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['year']):
        yearly_results[key] = list(group)
    return jsonify(yearly_results)


@app.route("/api/suicides_by_age")
def suicides_by_age():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = engine.execute("SELECT age, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY age ORDER BY suicides DESC")
    
    output = {}
    for result in results:
        output[result['age']] = int(result['suicides'])
    session.close()
    return jsonify(output)

@app.route("/api/yearly_suicides_by_age_country")
def yearly_suicides_by_age():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = engine.execute("SELECT year,age, country, iso_abr, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY age, country,iso_abr, year ORDER BY year;")
    
    output = []
    for result in results:
        output.append({
            'year': result['year'],
            'country': result['country'],
            'iso_abr': result['iso_abr'],
            'age': result['age'],
            'suicides': int(result['suicides'])
        })
    session.close()

    country_results = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('year'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['year']):
        country_results[key] = list(group)
    return jsonify(country_results)

@app.route("/api/yearly_suicides_by_age_country_plot")
def yearly_suicides_by_age_plot():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = engine.execute("SELECT year,age, country, SUM(suicides_no) AS suicides FROM suicidedata GROUP BY age, country,year ORDER BY year;")
    
    output = []
    for result in results:
        output.append({
            'year': result['year'],
            'country': result['country'],
            'age': result['age'],
            'suicides': int(result['suicides'])
        })
    session.close()

    country_results = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('country'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['country']):
        country_results[key] = list(group)
    return jsonify(country_results)

@app.route("/api/yearly_suicide_rate_by_TopTenCountry")
def yearly_suicide_rate_by_TopTenCountry():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    results = engine.execute("SELECT country, year, SUM(suicides_no) AS suicides, SUM(population) AS population FROM suicidedata GROUP BY country, year")
    
    output = []
    for result in results:
        suicide_rate_100k = round(float(result['suicides'])/float(result['population'])*100000,2)
        output.append({
            'year': result['year'],
            'country': result['country'],
            'suicide_rate_100k': suicide_rate_100k
        })

    session.close()

    top_ten_result = {}
    # Sort the results by year
    sorted_output = sorted(output, key=itemgetter('year'))
    # Assigning the objects into the same list for the same year data
    for key, group in itertools.groupby(sorted_output, key=lambda x:x['year']):
        top_ten_result[key] = sorted(list(group), key=lambda x:x['suicide_rate_100k'], reverse=True)[0:10]
    return jsonify(top_ten_result)

@app.route("/api/suicide_rate_by_TopTenCountry")
def suicide_rate_by_TopTenCountry():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    results = engine.execute("SELECT country, SUM(suicides_no) AS suicides, SUM(population) AS population FROM suicidedata GROUP BY country ORDER By suicides DESC LIMIT 10;")
    
    output = {}
    for result in results:
        output[result['country']] = round(float(result['suicides'])/float(result['population'])*100000,2)
    session.close()
    return jsonify(output)


@app.route("/api/v1.0/boundaries")
def boundary():
    with open("output data/country_15years_reduced.json") as file:
        json_decoded = json.load(file)

    return json_decoded
    
if __name__ == '__main__':
    app.run(debug=True)