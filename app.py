import os
from flask import Flask, render_template, redirect, jsonify
import pymongo
from pymongo import PyMongo
import time

MONGO_URL = os.environ.get('MONGOHQ_URL')
client = MongoClient(MONGO_URL)
db = client.app129715353

# Create an instance of Flask
app = Flask(__name__)

# # Use PyMongo to establish Mongo connection
# mongo = PyMongo(app, uri="mongodb://localhost:27017/project_two")

# Render to index.html template as homepage
@app.route("/")
def home():
    db.data_store.drop()
    return(render_template("index.html"))

# Render the group data from database for the first dropdown
@app.route("/group")
def group():
    ## For API Data Base    
    # stmt = db.data_api.distinct( "category" )
    # For CSV Data Base
    stmt = db.data_csv.distinct( "group" )
    # Return a list of the group data
    return jsonify(stmt)

# Render the food names from database for the second dropdown based on the first dropdown
@app.route("/names/<sample>")
def subnames(sample):
    ## For API Data Base
    # stmt = db.data_api.find({'category':sample}).distinct( "name" )
    # For CSV Data Base
    stmt = db.data_csv.find({'group':sample}).distinct( "name" )
    # Return a list of food names
    return jsonify(stmt)

# Render the panel data
@app.route("/print/<sample>")
def printpanel(sample):
    ## For API Data Base
    # x=[]
    # nutrient=['Water','Energy','Protein','Total lipid (fat)','Carbohydrate, by difference','Fiber, total dietary','Sugars, total']
    # for i in nutrient:
    #     x.append(db.data_api.find({'name': sample,'nutrient': f"{i}"})[0])
    # y=[]
    # for i in x:
    #     y.append(i['value'])
    # data=dict(zip(nutrient,y))
    
    # For CSV Data Base
    used_dic=list(db.data_csv.find({'name': sample}))[0]
    data={k:v for k, v in used_dic.items() if k != '_id' and k !='id'and k !='group'}
        # and k !='name'
    db.data_store.insert_one(used_dic)
    # Return the panel data
    return jsonify(data)

# Out the data for the historical selected food
@app.route("/print2")
def printlist():
    time.sleep(1)
    data_all = list(db.data_store.find())
    jdata=[]
        
    for used_dic in data_all:
        data={k:v for k, v in used_dic.items() if k != '_id'}
        jdata.append(data)
    # Return selected data
    return jsonify(jdata)


# Render the plot data for all food
@app.route("/plot")
def plot():
    data_all = list(db.data_csv.find())
    sugars=[]
    fats=[]
    names=[]
    for data in data_all:
        sugars.append(data['sugars'])
        fats.append(data['fat'])
        names.append(data['name'])
    jdata={'sugars':sugars,'fats':fats,'names':names}
    # Return plot data
    return jsonify(jdata)

# Render the plot data for one group of food
@app.route("/plot/<sample>")
def plot2(sample):
    data_all = list(db.data_csv.find({'group':sample}))
    sugars=[]
    fats=[]
    names=[]
    for data in data_all:
        sugars.append(data['sugars'])
        fats.append(data['fat'])
        names.append(data['name'])
    jdata={'sugars':sugars,'fats':fats,'names':names}
    # Return plot data
    return jsonify(jdata)

# Render the plot data for one selected food
@app.route("/plot2/<sample>")
def plot3(sample):
    data_all = list(db.data_csv.find({'name':sample}))
    sugars=[]
    fats=[]
    names=[]
    for data in data_all:
        sugars.append(data['sugars'])
        fats.append(data['fat'])
        names.append(data['name'])
    jdata={'sugars':sugars,'fats':fats,'names':names}
    # Return plot data
    return jsonify(jdata)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)