from flask import Flask
from flask_restful import Api, Resource, reqparse
from tika import parser
import os
from PIL import Image
import pytesseract
import argparse
import cv2
import io
import requests
import urllib.request
import urllib.parse
import numpy as np
import requests
import ast


app = Flask(__name__)
api = Api(app)

users = [
    {
        "name": "Nicholas",
        "age": 42,
        "occupation": "Network Engineer"
    },
    {
        "name": "Elvin",
        "age": 32,
        "occupation": "Doctor"
    },
    {
        "name": "Jass",
        "age": 22,
        "occupation": "Web Developer"
    }
]



def processOcr(img):
    #image = cv2.imread(img)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.threshold(gray, 0, 255,
        cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    filename = "{}.png".format(os.getpid())
    cv2.imwrite(filename, gray)
    text = pytesseract.image_to_string(Image.open(filename))
    os.remove(filename)
    return text


class User(Resource):
    def get(self, name):
        baseUrl= "https://tika-s3-poc-test.s3-us-west-1.amazonaws.com/"
        param = {
	        "fileName":name,		
	        "name": "getRequest",
	        "empId": "dummy"
	    }
        response = requests.post(
            url="https://d7vgjq4jy3.execute-api.us-east-1.amazonaws.com/dev/preurl",
            json=param
        )
        strContent = response.content.decode("utf-8")
        objUrl = ast.literal_eval(strContent)["body"]["url"]
        urllib.request.urlretrieve(objUrl, name)

        print("MMMMM trhe value is {}".format(objUrl))
        # testingUrl = baseUrl + name
        # print("The final url is {}".format(testingUrl))
        file_data = parser.from_file(name)
        text = file_data['content']
        print('MMMM YYYY {}'.format(text))
        for user in users:
            if("Nicholas" == user["name"]):
                return text, 200
            return "User not found", 404

    def post(self, name):
        parser = reqparse.RequestParser()
        parser.add_argument("age")
        parser.add_argument("occupation")
        args = parser.parse_args()

        for user in users:
            if(name == user["name"]):
                return "User with name {} already exists".format(name), 400

        user = {
            "name": name,
            "age": args["age"],
            "occupation": args["occupation"]
        }
        users.append(user)
        return user, 201

    def put(self, name):
        parser = reqparse.RequestParser()
        parser.add_argument("age")
        parser.add_argument("occupation")
        args = parser.parse_args()

        for user in users:
            if(name == user["name"]):
                user["age"] = args["age"]
                user["occupation"] = args["occupation"]
                return user, 200
        
        user = {
            "name": name,
            "age": args["age"],
            "occupation": args["occupation"]
        }
        users.append(user)
        return user, 201

    def delete(self, name):
        global users
        users = [user for user in users if user["name"] != name]
        return "{} is deleted.".format(name), 200
class Ocr(Resource):
    def get(self, name):
        baseUrl= "https://tika-s3-poc.s3.amazonaws.com/"
        testingUrl = baseUrl + name
        param = {
	        "fileName":name,		
	        "name": "getRequest",
	        "empId": "dummy"
	    }
        response = requests.post(
            url="https://d7vgjq4jy3.execute-api.us-east-1.amazonaws.com/dev/preurl",
            json=param
        )
        strContent = response.content.decode("utf-8")
        objUrl = ast.literal_eval(strContent)["body"]["url"]
        print("MMMMM trhe value is {}".format(objUrl))
        print("The final url is {}".format(testingUrl))
        req = urllib.request.urlopen(objUrl)
        arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
        img = cv2.imdecode(arr, -1)
        text = processOcr(img)
        print(text)
        for user in users:
            if("Nicholas" == user["name"]):
                return text, 200
            return "User not found", 404

api.add_resource(User, "/user/<string:name>")
api.add_resource(Ocr,"/ocr/<string:name>")

app.run(host='0.0.0.0')


