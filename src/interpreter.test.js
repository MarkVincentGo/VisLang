import interpretMain, {
  getMapOfLoops,
  getMapOfLines,
  parseValueTypes
} from './interpreter';

const exampleData1 = [
  {"id":6848117291621051,"type":"Constant","valueType":"Number","value":"3","deleted":false},
  {"id":3363880711066487,"type":"Assign Function","valueType":"Number","name":"x","args":[null],"value":"4","deleted":false,"reassign":false, func: function(incomingVal) {return incomingVal}},
  {"id":8537818589779925,"type":"Assign Function","valueType":"Number","name":"x","args":[7311797169605777],"value":"REF","deleted":false,"reassign":true, func: function(incomingVal) {return incomingVal}},
  {"id":8537818589235235,"type":"Assign Function","valueType":"Boolean","name":"a","args":[null],"value":"true","deleted":false,"reassign":false, func: function(incomingVal) {return incomingVal}},
  {"id":8537818589235235,"type":"Assign Function","valueType":"Null","name":"g","args":[null],"value":"null","deleted":false,"reassign":false, func: function(incomingVal) {return incomingVal}},
  {"id":749187023469151,"type":"Assign Function","valueType":"String","name":"y","args":[null],"value":"Example String","deleted":false,"reassign":false, func: function(incomingVal) {return incomingVal}},
  {"id":1841359398136499,"type":"Function","opType":"+","args":[5588662839888557,4427754624296531],"value":0,"deleted":false,"color":"#FCBB5B", func: (a, b) => a + b},
  {"id":3764808923143447,"type":"Function","opType":"+","args":[2142903589137191,8172900551307783],"value":0,"deleted":false,"color":"#FCBB5B", func: (a, b) => a + b},
  {"id":3027051986183469,"type":"Function","opType":"Print","args":[6273763653999555],"value":0,"deleted":false,"color":"lightgreen", func: function(incomingVal) {return incomingVal}},
  {"id":5588662839888557,"x1":236,"x2":270,"y1":248,"y2":309,"el1":6848117291621051,"el2":1841359398136499},
  {"id":4427754624296531,"x1":310,"x2":285,"y1":243,"y2":313,"el1":3363880711066487,"el2":1841359398136499},
  {"id":7311797169605777,"x1":276,"x2":311,"y1":342,"y2":383,"el1":1841359398136499,"el2":8537818589779925},
  {"id":2142903589137191,"x1":310,"x2":334,"y1":423,"y2":479,"el1":8537818589779925,"el2":3764808923143447},
  {"id":8172900551307783,"x1":457,"x2":347,"y1":410,"y2":480,"el1":749187023469151,"el2":3764808923143447},
  {"id":6273763653999555,"x1":342,"x2":350,"y1":512,"y2":559,"el1":3764808923143447,"el2":3027051986183469},
  {"id":4138091517968025,"x1":347,"x2":356,"y1":593,"y2":652,"el1":3027051986183469,"el2":-932},
  {"id":2275714908231919,"type":"Loop","args":[5588662839888557],"enclosedComponents":new Set([6848117291621051, 3363880711066487, 8537818589779925,1841359398136499]), func: function() {}},
  {"id":-932,"type":"End","args":[4138091517968025],"value":1, func: function(a) {return a}}, 
];

const exampleData2 = [
  {"id":6722098347217315,"type":"Assign Function","valueType":"Number","name":"x","args":[null],"value":"12","deleted":false,"reassign":false, func: function(incomingVal) {return incomingVal}},
  {"id":1869863911725161,"type":"Assign Function","valueType":"Number","name":"x","args":[4769432207514061],"value":"13","deleted":false,"reassign":false, func: function(incomingVal) {return incomingVal}},
  {"id":7347263271982183,"type":"Reference","variableReferenced":{"id":6722098347217315,"type":"Assign Function","valueType":"Number","name":"x","args":[null],"value":"12","deleted":false,"reassign":false},
  "value":null,"deleted":false, func: (scope) => scope.get("x")},
  {"id":6913668969678373,"type":"Function","opType":"+","args":[3907836055296149,7644029239153621],"value":0,"deleted":false,"color":"#FCBB5B", func: (a, b) => a + b},
  {"id":7644029239153621,"x1":336,"x2":314,"y1":252,"y2":404,"el1":7347263271982183,"el2":6913668969678373},
  {"id":2635659550107725,"x1":307,"x2":285,"y1":435,"y2":496,"el1":6913668969678373,"el2":-708},
  {"id":4769432207514061,"x1":251,"x2":237,"y1":263,"y2":316,"el1":6722098347217315,"el2":1869863911725161},
  {"id":3907836055296149,"x1":236,"x2":298,"y1":358,"y2":403,"el1":1869863911725161,"el2":6913668969678373},
  {"id":-708,"type":"End","args":[2635659550107725],"value":1, func: function(a) {return a}}
];


test('getMapOfLines functions correctly', () => {
  const result = getMapOfLines(exampleData1);
  expect(result.size).toBe(7)
});

test('getMapOfLoops functions correctly', () => {
  const [loopIdToLoopDataMap, mapOfRefIdToLoopId] = getMapOfLoops(exampleData1);
  expect(loopIdToLoopDataMap.size).toBe(1);
  expect(mapOfRefIdToLoopId.get(6848117291621051)).toBe(2275714908231919)
  expect(mapOfRefIdToLoopId.get(3363880711066487)).toBe(2275714908231919) 
  expect(mapOfRefIdToLoopId.get(8537818589779925)).toBe(2275714908231919) 
  expect(mapOfRefIdToLoopId.get(1841359398136499)).toBe(2275714908231919) 

});

test('parseValueTpes functions correctly', () => {
  const result = parseValueTypes(exampleData1);
  expect(result.length).toBe(exampleData1.length);
  
  const nonLineOrLoopTypes = result.filter((e) => e.valueType).map((e) => e.value);
  expect(nonLineOrLoopTypes).toEqual([3, 4, "REF", true, null, "Example String"])
})

test("default function functions correctly (example Case 1 - operation, loops, all data types, print)", () => {
  const result = interpretMain(exampleData1);
  expect(result).toEqual([ '7Example String', 'Last Return Value: 7Example String' ])
})

test("default function functions correctly (example Case 2 - variable references, variable reassigns)", () => {
  const result = interpretMain(exampleData2);
  expect(result).toEqual([ 'Last Return Value: 26' ])
})