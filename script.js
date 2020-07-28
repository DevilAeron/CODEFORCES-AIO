async function disp() {
			const username = document.getElementById('text1').value;
            const userApi = 'https://codeforces.com/api/user.info?handles=' + username;
            const response = await fetch(userApi);
            const data = await response.json();
            const error = data.status;
            if (error === "FAILED")  alert("Enter the valid handel!");
            const rating = data.result[0].rating;
            const rank = data.result[0].rank;
            const image = data.result[0].titlePhoto;
            const maxrating = data.result[0].maxRating;
            const dp=data.result[0].titlePhoto;
            document.getElementById('handle').textContent = username;
			document.getElementById('rank').textContent = rank;
			document.getElementById('rating').textContent = rating;
			document.getElementById('maxrating').textContent = maxrating;
            document.getElementById('image-id').src = dp;
    
            const userStatus = 'https://codeforces.com/api/user.status?handle=' + username;
            const response1 = await fetch(userStatus);
            const data1 = await response1.json();
            const resultLength = data1.result.length;
            
            var difficulty = new Array(28);
            for (let i = 0; i < 28; i++) difficulty[i] = 0;
            let AC = 0, WA = 0, TLE = 0, MLE = 0, RTE = 0, CE = 0;
            let mpIndex = new Map();
            let map = new Map();
            let mpTag = new Map();
            let mpLang = new Map();
            let mpUnsuc = new Map();
            let mpContest = new Map();
            let mpVirtual = new Map();
            let totalTried = 0;
            let totalTag = 0;
            let totalUnsolved = 0;
            for (let i = 0; i < resultLength; i++) {
                
                const temp = data1.result[i].verdict;
                const diff = data1.result[i].problem.rating;
                const contests = data1.result[i].contestId;
                const ptype = data1.result[i].author.participantType;
                var val = parseInt(diff);
                let mpval = data1.result[i].problem.tags;
                let mpind = data1.result[i].problem.index;
                let mplan = data1.result[i].programmingLanguage;
                val = val - 800;
                val = val / 100;
                
                if (mpUnsuc.get(data1.result[i].problem.name) !== 1) mpUnsuc.set(data1.result[i].problem.name, 1);
                
                if (mpContest.get(contests) !== 1 && ptype === 'CONTESTANT') mpContest.set(contests, 1);
                if (mpVirtual.get(contests) !== 1 && ptype === 'VIRTUAL') mpVirtual.set(contests, 1);

                if (mpLang.has(mplan)) mpLang.set(mplan, mpLang.get(mplan) + 1);
                else mpLang.set(mplan, 1);
                
                if (temp === "OK" && map.get(data1.result[i].problem.name) !== 1) {
                    totalTried++;
                    const taglen = mpval.length;
                    for (let j = 0; j < taglen; j++) {
                        if (mpTag.has(mpval[j])) mpTag.set(mpval[j], mpTag.get(mpval[j]) + 1);
                        else mpTag.set(mpval[[j]], 1);
                        totalTag++;
                    }
                    
                    if (mpIndex.has(mpind)) mpIndex.set(mpind, mpIndex.get(mpind) + 1);
                    else mpIndex.set(mpind, 1);
                    
                    difficulty[val] = difficulty[val] + 1;
                    map.set(data1.result[i].problem.name, 1);
                }
                if (temp === "OK") AC++;
                if (temp === "WRONG_ANSWER") WA++;
                if (temp === "TIME_LIMIT_EXCEEDED") TLE++;
                if (temp === "MEMORY_LIMIT_EXCEEDED") MLE++;
                if (temp === "RUNTIME_ERROR") RTE++;
                if (temp === "COMPILATION_ERROR") CE++;
            }
            totalUnsolved=mpUnsuc.length-totalTried;
            console.log(mpVirtual.size);
             
            //language pie chart
            
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart1);

            function drawChart1() {
            var arr = new Array();
            arr.push(["language","no of submission"]);
            for (let [key, value] of mpLang) {
              arr.push([key, value]);
            }    
            console.log(arr);
            var data = google.visualization.arrayToDataTable(arr);

            var options = {
              title: 'My Languages'
            };

            var chart = new google.visualization.PieChart(document.getElementById('languages'));

            chart.draw(data, options);
            }
    
            //map of submission status
    
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart2);

            function drawChart2() {
            
            var data = google.visualization.arrayToDataTable([
            ['status', 'Count'],
            ['OK', AC],
            ['WRONG_ANSWER', WA],
            ['RUNTIME_ERROR', RTE],
            ['TIME_LIMIT_EXCEEDED', TLE],
            ['MEMORY_LIMIT_EXCEEDED', MLE],
            ['COMPILATION_ERROR', CE],
            ]);
            var options = {
              title: 'My Verdicts'
            };

            var chart = new google.visualization.PieChart(document.getElementById('verdicts'));

            chart.draw(data, options);
            }
    
            // chart of tags
    
            
            
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart3);

            function drawChart3() {
            var arr = new Array();
            arr.push(["Tags","count"]);
            for (let [key, value] of mpTag) {
              arr.push([key, value]);
            }    
            var data = google.visualization.arrayToDataTable(arr);

            var options = {
              title: 'Tags Covered',
              pieHole: 0.4,
            };

            var chart = new google.visualization.PieChart(document.getElementById('tags'));

            chart.draw(data, options);
            }
    
            google.charts.load("current", {packages:['corechart']});
            google.charts.setOnLoadCallback(drawChart4);
            function drawChart4() {
                
              var xarr = new Array();
              xarr.push(["Indexes", "Solved", { role: "style" } ]);
                
              for (let [key, value] of mpIndex) {
                  xarr.push([key, value, "gold"]);
              }
              var arr = xarr.sort(function (x, y) {
                  if (x[0] < y[0]) return 1;
                  else return -1;
              });
                
              var data = google.visualization.arrayToDataTable(arr);

              var view = new google.visualization.DataView(data);
              view.setColumns([0, 1,
                               { calc: "stringify",
                                 sourceColumn: 1,
                                 type: "string",
                                 role: "annotation" },
                               2]);

              var options = {
                title: "Indexes Solved",
                width: 600,
                height: 400,
                bar: {groupWidth: "95%"},
                legend: { position: "none" },
              };
              var chart = new google.visualization.ColumnChart(document.getElementById("indexes"));
              chart.draw(view, options);
            }
            
            google.charts.load("current", {packages:['corechart']});
            google.charts.setOnLoadCallback(drawChart5);
            function drawChart5() {
                
              var arr = new Array();
              arr.push(["Ratings", "Solved", { role: "style" } ]);
              console.log(difficulty);    
              for (let i = 0; i < 28; i++) {
                  if (difficulty[i] !== 0) arr.push([i * 100 + 800, difficulty[i], "gold"]);
              }
              console.log(arr);
              var data = google.visualization.arrayToDataTable(arr);

              var view = new google.visualization.DataView(data);
              view.setColumns([0, 1,
                               { calc: "stringify",
                                 sourceColumn: 1,
                                 type: "string",
                                 role: "annotation" },
                               2]);

              var options = {
                title: "Ratings Solved",
                width: 600,
                height: 400,
                bar: {groupWidth: "95%"},
                legend: { position: "none" },
              };
              var chart = new google.visualization.ColumnChart(document.getElementById("ratings"));
              chart.draw(view, options);
            }
}