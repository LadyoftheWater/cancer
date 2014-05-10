// Generated by LiveScript 1.2.0
var fs, population, cancer, all, i$, year, j$, idx, county, ref$, towns, town, ref1$, count, ref2$, ref3$, list;
fs = require('fs');
population = JSON.parse(fs.readFileSync('population.json').toString());
cancer = JSON.parse(fs.readFileSync('total.json').toString()).value;
all = {};
for (i$ = 93; i$ <= 101; ++i$) {
  year = i$;
  for (j$ = 1; j$ <= 15; ++j$) {
    idx = j$;
    for (county in ref$ = cancer[year][idx]) {
      towns = ref$[county];
      for (town in ref1$ = cancer[year][idx][county]) {
        count = ref1$[town];
        if (!county || !town) {
          continue;
        }
        (ref2$ = (ref3$ = all[year] || (all[year] = {}))[county] || (ref3$[county] = {}))[town] == null && (ref2$[town] = 0);
        ((ref2$ = all[year] || (all[year] = {}))[county] || (ref2$[county] = {}))[town] += cancer[year][idx][county][town];
      }
    }
  }
}
for (i$ = 93; i$ <= 101; ++i$) {
  year = i$;
  list = [];
  for (county in ref$ = all[year]) {
    towns = ref$[county];
    for (town in ref1$ = all[year][county]) {
      count = ref1$[town];
      all[year][county][town] /= population[year][county][town];
      list.push({
        value: all[year][county][town],
        county: county,
        town: town
      });
    }
  }
  list.sort(fn$);
  console.log(list.slice(0, 10));
}
function fn$(a, b){
  return b.value - a.value;
}