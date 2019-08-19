# from tika import parser
# import os
# return {
#         'statusCode': 200,
#         'body': json.dumps('Hello from Lambda!')
#     }

# file = os.path.abspath("C:/Users/manraju/Desktop/iest.pdf")

# # Parse data from file
# file_data = parser.from_file(file)
# # Get files text content
# text = file_data['content']
# print(text)

import json
import urllib.request
from elasticsearch import Elasticsearch, RequestsHttpConnection
import boto3
from requests_aws4auth import AWS4Auth

region = 'us-west-1'
service = 'es'
session = boto3.Session()
credentials = session.get_credentials()

awsauth = AWS4Auth(credentials.access_key, credentials.secret_key,region, service,session_token=credentials.token)

request_body = {
    "settings" : {
	        "number_of_shards": 1,
	        "number_of_replicas": 0
	    },

	    'mappings': {
	            'properties': {
	                'filename': {'type': 'text'},
	                'fileContent': {'type': 'text'},
	            }}
}

def connectES(esEndPoint):
    print ('Connecting to the ES Endpoint {0}'.format(esEndPoint))
    try:
        esClient = Elasticsearch(
            hosts=[{'host': esEndPoint, 'port': 443}],
            use_ssl=True,
            verify_certs=True,
            http_auth = awsauth,
            connection_class=RequestsHttpConnection)
        return esClient
    except Exception as E:
        print("Unable to connect to {0}".format(esEndPoint))
        print(E)
        exit(3)

def createIndex(esClient):
    print('esclient MMMM is {}'.format(esClient))
    try:
        res = esClient.indices.exists('talent-hub')
        print("Index Exists ... {}".format(res))
        if res is False:
            esClient.indices.create('talent-hub', body=request_body)
            return 1
    except Exception as E:
        print("Unable to Create Index {0}".format("talent-hub"))
        print(E)
        exit(4)

def indexDocElement(esClient, fileName, fileContent):
    try:
        retval = esClient.index(index='talent-hub', body={
            'fileName': fileName,
            'fileContent': fileContent,
        })
    except Exception as E:
        print("Doc not indexed")
        print("Error: ",E)
        exit(5)

def lambda_handler(event, context):
    print('MMMMM',event)
    # TODO implement
    restUrl = "http://XX.XX.XXX.XXX:5000/user/"
    key = event['Records'][0]['s3']['object']['key']
    finalUrl = restUrl + key
    print('The value of object is {}'.format(finalUrl))
    contents = urllib.request.urlopen(finalUrl).read()
    print(contents)
    strContents = contents.decode("utf-8") 
    strContents = strContents.replace(r"\n", "")
    print('string contents MMMM is {}'.format(strContents))
    esClient = connectES("search-tika-es-bn3u2vyptgvxdnjzw2ieewnllq.us-west-1.es.amazonaws.com")
    createIndex(esClient)
    try:
        indexDocElement(esClient,key,strContents)
    except Exception as e:
        print('There is a error MMMM')
        print(e)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
