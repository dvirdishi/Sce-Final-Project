let app = angular.module('app', ["chart.js"]);
	app.controller('dashboardController', ['$scope', function ($scope) {

		//helping list for the graph updating
		let formatHour = (hour)=>{
			let hourStr= '';
			if(hour < 10)
				hourStr = `0${hour}:00`;
			else
				hourStr = `${hour}:00`;
			return hourStr;
		}

		$scope.adimage = null;

		$scope.traffic_trend = {};


		//tabs mechanisem
		$scope.tab = 1;

		$scope.setTab = function (newTab) {
			$scope.tab = newTab;
		};

		$scope.isSet = function (tabNum) {
			return $scope.tab === tabNum;
		};


		let updateDetectionImage = (detectionImage)=> {

			$scope.detectionimage = detectionImage;
			let imageD = new Image();
			imageD.src = detectionImage;

		}

		let updateAdImage = (adImage) => {

			$scope.adimage = '/public/images/advertisements/' + adImage;
			$scope.$apply();
		}

		let updateGraphsOnDetection = (detectedEntities) => {

			//update radarGraph
			
			for (const entity of detectedEntities) {
			
				//first graph:
				for (let i = 0; i < $scope.visitors_num_labels.length; i++) {
					const ageClass = $scope.visitors_num_labels[i];

					if(ageClass == entity.ageClass){

						if(entity.gender == 'male')
							$scope.visitors_num_data[0][i]++;
						else
							$scope.visitors_num_data[1][i]++;

					}
					
				}

				//second graph:
				const currentHour = (new Date()).getHours();
				let currentHouresExist = $scope.todays_entities_labels.data;
				//if the corrent hour == lastHour + 1
				if(currentHour != currentHouresExist[currentHouresExist.length - 1]){

					$scope.todays_entities_labels.data.push(currentHour);
					$scope.todays_entities_labels.labels.push(formatHour(currentHour));
					if(entity.gender == 'male'){
						$scope.todays_entities_data[0].push(1);
						$scope.todays_entities_data[1].push(0);
					}
					else {
						$scope.todays_entities_data[0].push(0);
						$scope.todays_entities_data[1].push(1);
					}

				} else{
					//adding person to exist hour
					//set temp vars
					let entitiesDataMale = $scope.todays_entities_data[0];
					let entitiesDataFemale = $scope.todays_entities_data[1];

					if(entity.gender == 'male'){
						entitiesDataMale[entitiesDataMale.length - 1]++;
					}
					else {
						entitiesDataFemale[entitiesDataFemale.length - 1]++;
					}

				}

				//male vs female Graph:
				if(entity.gender == 'male')
					$scope.male_vs_female_data[0]++;
				else
					$scope.male_vs_female_data[1]++;

				//visitors number Graph
				$scope.visitors_number++;


				//ratio graph:
				$scope.traffic_trend.detectionsBeforeToday++;
				$scope.traffic_trend.detectionsToday++;

				let v1 = $scope.traffic_trend.detectionsBeforeToday;
				let v2 = $scope.traffic_trend.detectionsToday;

				let diff = Math.round(((v2 - v1) / Math.abs(v1)) * 100);
				let ratioSign;
				let ratio;
				if (diff >= 0) {
					ratioSign = '+';
					ratio = diff;
				}
				else{
					ratioSign = '-';
					ratio = Math.abs(diff);
				}

				let trafficTrendStr = ratioSign + ratio + '%';
				$scope.traffic_trend.ratio = trafficTrendStr;

			}


			$scope.$apply();
		}


		var socket = io();
		socket.on('stream', function (data) {
			console.log('data', data);

			updateDetectionImage(data.detectionImage);
			updateAdImage(data.adImage);
			updateGraphsOnDetection(data.detectedEntities);

		});

		//statiscs:
		$scope.male_female_series = ['Male', 'Female'];

		axios.get('/getTodaysEntitiesCountPerAgeClass')
			.then(function (response) {
				$scope.visitors_num_labels = [];
				$scope.visitors_num_data = [[], []];
				for (const key in response.data) {
					if (response.data.hasOwnProperty(key)) {
						const element = response.data[key];

						$scope.visitors_num_labels.push(element.ageClass);
						$scope.visitors_num_data[0].push(parseInt(element.male));
						$scope.visitors_num_data[1].push(parseInt(element.female));

					}
				}
				$scope.$apply();
			})


		axios.get('/getTodaysNumOfEntitiesByHour')
			.then(function (response) {
				$scope.todays_entities_labels = {labels:[],data:[]};
				$scope.todays_entities_data = [[], []];

				for (const obj of response.data) {
					$scope.todays_entities_labels.data.push(obj.hour);
					$scope.todays_entities_labels.labels.push(formatHour(obj.hour));
					$scope.todays_entities_data[0].push(parseInt(obj.male));
					$scope.todays_entities_data[1].push(parseInt(obj.female));

				}

				$scope.$apply();
			})


			axios.get('/getTodaysMaleFemaleNum')
			.then(function (response) {
				$scope.male_vs_female_data = [];
				$scope.male_vs_female_labels = ['Male', 'Female'];
				$scope.male_vs_female_data.push(response.data.male);
				$scope.male_vs_female_data.push(response.data.female);
				$scope.$apply();
			})

			axios.get('/getTodaysVistorsNum')
			.then(function (response) {
				$scope.visitors_number = response.data;
			})

			axios.get('/getTrafficAbsoluteRatio')
			.then(function (response) {
				console.log('reeeessss', response.data);
				
				let trafficTrendStr = response.data.sign + response.data.ratio + '%';
				$scope.traffic_trend.ratio = trafficTrendStr;
				$scope.traffic_trend.detectionsBeforeToday = response.data.detectionsBeforeToday;
				$scope.traffic_trend.detectionsToday = response.data.detectionsToday;
			})


		$scope.colors = [

			{
				//male
				backgroundColor: "rgba(0, 112, 204, 0.2)",
				pointBackgroundColor: "rgba(0, 112, 204, 1)",
				borderColor: "rgba(0, 112, 204, 1)",
				pointHoverBorderColor: "rgba(159,204,0, 1)"
			},
			{
				//female
				backgroundColor: "rgba(204, 0, 95, 0.2)",
				pointBackgroundColor: "rgba(204, 0, 95, 1)",
				borderColor: "rgba(204, 0, 95, 1)",
				pointHoverBorderColor: "rgba(159,204,0, 1)"
			}
		];

		  
	}]);