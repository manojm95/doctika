import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import * as elasticsearch from 'elasticsearch-browser';
 
@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {
 
  private client: Client;
 
  constructor() {
    if (!this.client) {
      this._connect();
    }
  }
 
  private connect() {
    this.client = new Client({
      host: 'https://search-tika-es-bn3u2vyptgvxdnjzw2ieewnllq.us-west-1.es.amazonaws.com',
      log: 'trace'
    });
  }
 
  private _connect() {
    this.client = new elasticsearch.Client({
      host: 'https://search-tika-es-bn3u2vyptgvxdnjzw2ieewnllq.us-west-1.es.amazonaws.com',
      log: 'trace'
    });
  }
 
  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'hello grokonez!'
    });
  }
  
  addToIndex(value: any): any {
    return this.client.create(value);
  }

  private queryalldocs = {
    'query': {
      'match_all': {}
    }
  };
 
  getAllDocuments(_index: any, _type: any): any {
    return this.client.search({
      index: _index,
      type: _type,
      body: this.queryalldocs,
      filterPath: ['hits.hits._source']
    });
  }

  getAllDocumentsWithScroll(_index: any, _type: any, _size: any): any {
    return this.client.search({
      index: _index,
      type: _type,
      // Set to 1 minute because we are calling right back
      // (Elasticsearch keeps the search context open for another 1m)
      scroll: '1m',
      filterPath: ['hits.hits._source', 'hits.total', '_scroll_id'],
      body: {
        'size': _size,
        'query': {
          'match_all': {}
        },
        'sort': [
          { '_uid': { 'order': 'asc' } }
        ]
      }
    });
  }

  getNextPage(scroll_id: any): any {
    return this.client.scroll({
      scrollId: scroll_id,
      scroll: '1m',
      filterPath: ['hits.hits._source', 'hits.total', '_scroll_id']
    });
  }

  fullTextSearch(_index: any, _type:any, _field:any, _queryText: any): any {
    return this.client.search({
      index: _index,
      type: _type,
      filterPath: ['hits.hits._source', 'hits.total', '_scroll_id'],
      body: {
        'query': {
          'match_phrase_prefix': {
            [_field]: _queryText,
          }
        }
      },
      '_source': ['name', 'empId']
    });
  }


}