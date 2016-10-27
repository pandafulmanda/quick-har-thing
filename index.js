var _ = require('lodash');

var MATCHING_REQUEST_URL = 'https://communitycrimemap.com/Protected/RAIDS/Data/DataGrid.serv';
var HAR_PATH = '../../Downloads/communitycrimemap.com.har';
var data = require(HAR_PATH);

// Makes a function that will:
//  Loop over an array of entries, and
//  Filters for where entry.request.url = MATCHING_REQUEST_URL.
var filterEntriesForMatchingRequests = _.partial(_.filter, _, ['request.url', MATCHING_REQUEST_URL]);

// Makes a function that will:
//  Map over an array of entries
//  The entry.response.content.text converted from text to an object, and
//  Return just the dataEvents for the response content.
var mapEntriesForDataEvents = _.partial(_.map, _, function(entry){
  return JSON.parse(entry.response.content.text).dataEvents;
});

// Makes a function that will:
//  Filter for matching entries
//  Map matching entries to get just the data events, and
//  Flattens the resulting nested arrays to get just one big array of data events.
var mapMatchingEntriesForResponse = _.flow(
  filterEntriesForMatchingRequests,
  mapEntriesForDataEvents,
  _.flatten
);

// Run the function on just the entries in the har.
var matchingResponses = mapMatchingEntriesForResponse(data.log.entries)

console.info(matchingResponses)
