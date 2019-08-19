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
	                'name': {'type': 'text'},
	                'empId': {'type': 'text'},
	                'content': {'type': 'text'},
	                'objectUrl': {'type': 'text'},
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
        res = esClient.indices.exists('thz_indexv1')
        print("Index Exists ... {}".format(res))
        if res is False:
            esClient.indices.create('thz_indexv1', body=request_body)
            return 1
    except Exception as E:
        print("Unable to Create Index {0}".format("thz_indexv1"))
        print(E)
        exit(4)

def indexDocElement(esClient, name, empId, content, objectUrl):
    try:
        retval = esClient.index(index='thz_indexv1', body={
            'name': name.replace(r"+", " "),
            'content': content,
            'empId': empId,
            'objectUrl': objectUrl
        })
    except Exception as E:
        print("Doc not indexed")
        print("Error: ",E)
        exit(5)

def lambda_handler(event, context):
    print('MMMMM',event)
    # TODO implement
    baseUrl= "https://XXX/"
    restUrl = "http://yyy:5000/user/"
    key = event['Records'][0]['s3']['object']['key']
    vals = key.split('_')
    finalUrl = restUrl + key
    print('The value of object is {}'.format(finalUrl))
    contents = urllib.request.urlopen(finalUrl).read()
    print(contents)
    strContents = contents.decode("utf-8") 
    strContents = strContents.replace(r"\n", "").replace(r"\t", "").replace(r"\u00b7", "").replace(r"\u00a0", "").replace(r"\u2019s", "").replace('\u201c','').replace('\u201d','')
    print('string contents MMMM is {}'.format(strContents))
    esClient = connectES("xxx")#without http://
    createIndex(esClient)
    try:
        indexDocElement(esClient,vals[1],vals[2],strContents,baseUrl+key)
    except Exception as e:
        print('There is a error MMMM')
        print(e)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
