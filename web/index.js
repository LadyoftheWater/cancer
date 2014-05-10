// Generated by LiveScript 1.2.0
var year, power, buildTaiwan, buildData, convert, idx, updateDesc, updateValue, main;
year = {
  start: 93,
  end: 101
};
power = 1;
buildTaiwan = function(cb){
  return d3.json('twTown1982.topo.json', function(data){
    var topo, topomesh, color, ref$, w, h, m, prj, path, svg;
    topo = topojson.feature(data, data.objects["twTown1982.geo"]);
    topomesh = topojson.mesh(data, data.objects["twTown1982.geo"], function(a, b){
      return a !== b;
    });
    color = d3.scale.category20();
    ref$ = [400, 600], w = ref$[0], h = ref$[1];
    m = [20, 20, 20, 20];
    prj = d3.geo.mercator().center([120.979531, 23.978567]).scale(100000);
    path = d3.geo.path().projection(prj);
    svg = d3.select('#content').append('svg').attr('width', w).attr('height', h).attr('viewBox', "0 0 800 600").attr('preserveAspectRatio', 'xMidYMid');
    svg.selectAll('path.county').data(topo.features).enter().append('path').attr('class', 'county').attr('d', path).style('fill', function(){
      return color(Math.random());
    }).style('stroke', 'none').style('opacity', 0.9);
    svg.append('path').attr('class', 'boundary').datum(topomesh).attr('d', path).style('fill', 'none').style('stroke', "rgba(255,255,255,0.5)").style('stroke-width', '2px');
    return cb(svg, topo);
  });
};
buildData = function(cb){
  return d3.json('total.json', function(cancer){
    return d3.json('population.json', function(population){
      return cb(cancer, population);
    });
  });
};
convert = function(county, town){
  if (county === '台北市' || county === '台北縣' || county === '台中縣' || county === '台南縣' || county === '高雄縣') {
    town = town.substring(0, town.length - 1) + "區";
    if (county === '台北縣') {
      county = '新北市';
    }
    county = county.replace('縣', '市');
  }
  return [county, town];
};
idx = year.start;
updateDesc = function($scope){
  var d;
  d = $scope.target;
  return $scope.desc = d.properties.TOWNNAME + " : 肺癌人數 " + d.properties.cancer + " / 人口數 " + d.properties.population + " = " + d.properties.value;
};
updateValue = function($scope, svg, topo, cancer, population){
  var ref$, min, max, i$, len$, it, ref1$, county, town, color, frange;
  ref$ = [-1, -1], min = ref$[0], max = ref$[1];
  for (i$ = 0, len$ = (ref$ = topo.features).length; i$ < len$; ++i$) {
    it = ref$[i$];
    ref1$ = convert(it.properties.COUNTYNAME, it.properties.TOWNNAME), county = ref1$[0], town = ref1$[1];
    it.properties.value = cancer.value[idx][1][county][town] / population[idx][county][town];
    it.properties.cancer = cancer.value[idx][1][county][town];
    it.properties.population = population[idx][county][town];
    if (min === -1 || min > it.properties.value) {
      min = it.properties.value;
    }
    if (max === -1 || max < it.properties.value) {
      max = it.properties.value;
    }
  }
  min = Math.pow(min, power);
  max = Math.pow(max, power);
  color = d3.scale.linear().domain([0, max / 2, max]).range(['#777', '#ff0', '#f00']);
  frange = d3.scale.linear().domain([0, max]).range([0, 255]);
  return svg.selectAll('path.county').on('mouseover', function(d){
    var this$ = this;
    return $scope.$apply(function(){
      $scope.target = d;
      return updateDesc($scope);
    });
  }).style('fill', function(it){
    if (isNaN(it.properties.value)) {
      return "rgba(255,255,255,1)";
    }
    return color(Math.pow(it.properties.value, power));
  });
};
main = function($scope, $interval){
  return buildData(function(cancer, population){
    return buildTaiwan(function(svg, topo){
      return $interval(function(){
        $scope.idx = idx;
        updateValue($scope, svg, topo, cancer, population);
        idx = idx + 1;
        if (idx > year.end) {
          idx = year.start;
        }
        return updateDesc($scope);
      }, 500);
    });
  });
};