// Generated by LiveScript 1.2.0
var main;
main = function($scope, $timeout, $interval){
  $scope.chosen = "點地圖看值";
  return d3.json('population.json', function(popu){
    return d3.json('all-data.json', function(cancer){
      var res$, k;
      res$ = [];
      for (k in cancer.data) {
        res$.push(k);
      }
      $scope.years = res$;
      $scope.diseases = cancer.types;
      $scope.curyear = $scope.years[0];
      $scope.curdis = $scope.diseases[0];
      $scope.playing = false;
      $scope.yearIndex = 0;
      $scope.stop = function(){
        if ($scope.playing) {
          $interval.cancel($scope.playing);
        }
        return $scope.playing = false;
      };
      $scope.play = function(){
        var i$, to$, i;
        if ($scope.playing) {
          return;
        }
        for (i$ = 0, to$ = $scope.years.length; i$ < to$; ++i$) {
          i = i$;
          if ($scope.years[i] === $scope.curyear) {
            $scope.yearIndex = i;
            break;
          }
        }
        return $scope.playing = $interval(function(){
          var results$ = [];
          do {
            $scope.curyear = $scope.years[$scope.yearIndex];
            $scope.yearIndex++;
            if ($scope.yearIndex >= $scope.years.length) {
              results$.push($scope.yearIndex = 0);
            }
          } while ($scope.curyear < 1991 && $scope.normalize);
          return results$;
        }, 200);
      };
      $scope.updateData = function(){
        var data;
        data = $scope.cancerData($scope.map);
        return $scope.updateMap($scope.map, data);
      };
      $scope.$watch('curyear', function(){
        return $scope.updateData();
      });
      $scope.$watch('curdis', function(){
        return $scope.updateData();
      });
      return d3.json('rpi.json', function(rpi){
        $scope.$watch('chosen', function(){
          return $scope.chosenValue = $scope.hash[$scope.chosen];
        });
        $scope.$watch('chosen', function(){
          return $scope.chosenValue = $scope.hash[$scope.chosen];
        });
        $scope.cancerData = function(map){
          var d, k, v;
          d = cancer.data[$scope.curyear][$scope.curdis] || {};
          $scope.hash = {};
          for (k in d) {
            v = d[k];
            $scope.hash[cancer.townmap[parseInt(k)]] = v;
          }
          $scope.chosenValue = $scope.hash[$scope.chosen];
          return $scope.hash;
        };
        $scope.randomData = function(map){
          var ret, i$, ref$, len$, item;
          ret = {};
          for (i$ = 0, len$ = (ref$ = map.topo.features).length; i$ < len$; ++i$) {
            item = ref$[i$];
            ret[item.properties.name] = Math.random() * 1000;
          }
          return ret;
        };
        $scope.updateMap = function(map, data){
          var min, towns, max;
          min = -1;
          towns = map.svg.selectAll('path.town').each(function(it){
            var v, ref$, c, t, mgyear, p;
            v = data[it.properties.name] || 0;
            it.properties.value = v;
            ref$ = it.properties.name.split('/'), c = ref$[0], t = ref$[1];
            mgyear = parseInt($scope.curyear) - 1911;
            p = popu[mgyear] ? popu[mgyear][c][t] : 0;
            if (t === "中西區" && !p && popu[mgyear]) {
              p = popu[mgyear][c]["中區"] + popu[mgyear][c]["西區"];
            }
            it.properties.nvalue = p ? parseInt(100000 * v / p) / 1000 : 0;
            v = $scope.normalize
              ? it.properties.nvalue
              : it.properties.value;
            if (v && (min === -1 || min > v)) {
              return min = v;
            }
          });
          max = d3.max(map.topo.features, function(it){
            if ($scope.normalize) {
              return it.properties.nvalue;
            } else {
              return it.properties.value;
            }
          });
          if (min <= 0) {
            min = 0.0001;
          }
          if (max <= 0) {
            max = 0.2;
          }
          map.heatmap = d3.scale.linear().domain([0, min, (min * 2 + max) / 2, max]).range(map.heatrange);
          towns.transition().duration(300).style({
            fill: function(it){
              return map.heatmap($scope.normalize
                ? it.properties.nvalue
                : it.properties.value);
            },
            stroke: function(it){
              return map.heatmap($scope.normalize
                ? it.properties.nvalue
                : it.properties.value);
            }
          });
          return $scope.makeTick(map);
        };
        $scope.makeTick = function(map){
          var svg, heatmap, tickcount, htick, domain, res$, i$, step$, to$, i, x$, y$;
          svg = map.svg, heatmap = map.heatmap, tickcount = map.tickcount;
          htick = heatmap.ticks(tickcount);
          domain = heatmap.domain();
          res$ = [];
          for (i$ = 0, to$ = domain[domain.length - 1], step$ = domain[domain.length - 1] / 10; step$ < 0 ? i$ >= to$ : i$ <= to$; i$ += step$) {
            i = i$;
            res$.push(parseInt(i * 1000) / 1000);
          }
          htick = res$;
          x$ = svg.selectAll('rect.tick').data(htick);
          x$.exit().remove();
          x$.enter().append('rect').attr('class', 'tick');
          svg.selectAll('rect.tick').attr({
            width: 20,
            height: 15,
            x: 150,
            y: function(d, i){
              return 50 + i * 15;
            },
            fill: function(it){
              return heatmap(it);
            }
          });
          y$ = svg.selectAll('text.tick').data(htick);
          y$.exit().remove();
          y$.enter().append('text').attr('class', 'tick');
          return svg.selectAll('text.tick').attr({
            'class': 'tick',
            x: 175,
            y: function(d, i){
              return 63 + i * 15;
            }
          }).text(function(it){
            return it;
          });
        };
        $scope.initMap = function(node, cb){
          return d3.json('twTown1982.topo.json', function(data){
            var ret, topo, prj2, prj, path, svg, color, town, ref$, r, g, b, i$, len$, item, c, heatrange, heatmap, tickcount;
            ret = {};
            topo = topojson.feature(data, data.objects["twTown1982.geo"]);
            topo.features.map(function(it){
              it.properties.TOWNNAME = it.properties.TOWNNAME.replace(/\(.+\)?\s*$/g, "");
              return it.properties.name = it.properties.name.replace(/\s*\(.+\)?\s*$/g, "");
            });
            prj2 = d3.geo.mercator().center([120.979531, 23.978567]).scale(50000);
            prj = function(arg$){
              var x, y;
              x = arg$[0], y = arg$[1];
              if (x < 119) {
                x += 1;
              }
              return prj2([x, y]);
            };
            path = d3.geo.path().projection(prj);
            svg = d3.select(node);
            color = {};
            town = {};
            ref$ = [5, 5, 5], r = ref$[0], g = ref$[1], b = ref$[2];
            for (i$ = 0, len$ = (ref$ = topo.features).length; i$ < len$; ++i$) {
              item = ref$[i$];
              c = "rgb(" + r + "," + g + "," + b + ")";
              color[c] = item.properties.TOWNNAME;
              item.properties.c = c;
              town[item.properties.TOWNNAME] = item;
              r += 10;
              if (r > 255) {
                r = 5;
                g += 10;
              }
              if (g > 255) {
                g = 5;
                b += 10;
              }
            }
            svg.selectAll('path.town').data(topo.features).enter().append('path').attr('class', 'town').attr('d', path).style('fill', function(it){
              return it.properties.c;
            }).style('stroke', function(it){
              return it.properties.c;
            }).style('stroke-width', '0.5px').style('opacity', 1.0).on('mouseover', function(d){
              return $scope.$apply(function(){
                return $scope.chosen = d.properties.name;
              });
            }).on('click', function(d){
              return $scope.$apply(function(){
                return $scope.chosen = d.properties.name;
              });
            });
            heatrange = ['#494', '#6c0', '#ff0', '#f00'];
            heatmap = d3.scale.linear().domain([0, 1, 2, 5]).range(heatrange);
            tickcount = 10;
            ret.svg = svg;
            ret.prj = prj;
            ret.path = path;
            ret.heatmap = heatmap;
            ret.heatrange = heatrange;
            ret.topo = topo;
            ret.tickcount = tickcount;
            $scope.makeTick(ret);
            return cb(ret);
          });
        };
        return $scope.initMap('#svg', function(it){
          $scope.map = it;
          return $timeout(function(){
            var data;
            data = $scope.cancerData($scope.map);
            return $scope.updateMap($scope.map, data);
          }, 1000);
        });
      });
    });
  });
};