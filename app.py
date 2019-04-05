import os
from flask import Flask, render_template, redirect, jsonify
import pymongo
from pymongo import MongoClient
from flask_pymongo import PyMongo

MONGO_URL = os.environ.get('MONGOHQ_URL')
client = MongoClient(MONGO_URL)
db = client.app129715353

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
# mongo = PyMongo(app, uri="mongodb://localhost:27017/project_two")

@app.route("/")
def home():
    return (render_template("index.html"))

# Route to render index.html template using data from Mongo
@app.route("/plot")
def plot():

    # Find one record of data from the mongo database
    data_all = list(db.data_csv.find())
    # print(data_all[0]['fat'])
    # print(data_all[0])
    sugars=[]
    fats=[]
    names=[]
    for data in data_all:
        fats.append(data['fat'])
        sugars.append(data['sugars'])
        names.append(data['name'])
    jdata={'sugars':sugars,'fats':fats,'names':names}
    # Return template and data
    return jsonify(jdata)

@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    # stmt = mongo.db.data_api.distinct( "category" )
    
    stmt = db.data_csv.distinct( "group" )
    # Return a list of the column names (sample names)
    return jsonify(stmt)

@app.route("/names/<sample>")
def subnames(sample):
    """Return a list of sample names."""
    
    # Use Pandas to perform the sql query
    # stmt = mongo.db.data_api.find({'category':sample}).distinct( "name" )
    
    stmt = db.data_csv.find({'group':sample}).distinct( "name" )
    # Return a list of the column names (sample names)
    return jsonify(stmt)

@app.route("/plot/<sample>")
def plot2(sample):
    """Return a list of sample names."""
    
    data_all = list(db.data_csv.find({'group':sample}))
    sugars=[]
    fats=[]
    names=[]
    for data in data_all:
        sugars.append(data['sugars'])
        fats.append(data['fat'])
        names.append(data['name'])
    jdata={'sugars':sugars,'fats':fats,'names':names}
    # Return a list of the column names (sample names)
    return jsonify(jdata)

@app.route("/plot2/<sample>")
def plot3(sample):
    """Return a list of sample names."""
    
    data_all = list(db.data_csv.find({'name':sample}))
    sugars=[]
    fats=[]
    names=[]
    for data in data_all:
        sugars.append(data['sugars'])
        fats.append(data['fat'])
        names.append(data['name'])
    jdata={'sugars':sugars,'fats':fats,'names':names}
    # Return a list of the column names (sample names)
    return jsonify(jdata)

@app.route("/print/<sample>")
def printpanel(sample):
    """Return a list of sample names."""
    # x=[]
    # nutrient=['Water','Energy','Protein','Total lipid (fat)','Carbohydrate, by difference','Fiber, total dietary','Sugars, total']
    # for i in nutrient:
    #     x.append(mongo.db.data_api.find({'name': sample,'nutrient': f"{i}"})[0])
    # y=[]
    # for i in x:
    #     y.append(i['value'])
    # data=dict(zip(nutrient,y))
    used_dic=list(db.data_csv.find({'name': sample}))[0]
    data={k:v for k, v in used_dic.items() if k != '_id' and k !='id'and k !='group'and k !='name'}
        
    # # Return a list of the column names (sample names)
    # mongo.db.data_store.insertOne(data)
    return jsonify(data)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)