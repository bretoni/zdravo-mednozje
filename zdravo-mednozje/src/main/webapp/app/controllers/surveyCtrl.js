(function () {
    "use strict";

    angular.module("ASPO").controller('SurveyCtrl', ["$scope", "AspoService", function ($scope, aspoService) {
        var that = this; // Save this into that for better minification results.
		
		that.answered = [{questionId: 0, answerId: 0}];
		that.questions = {}; // database of all questions
		$scope.displayedQuestions = []; // Questions in fringe, that were or will be displayed
		$scope.displayNr = 0; // Index of current questions in carousel
		
		// Mark current answer as inactive and set
		// next questions as active.
		function changeQuestion(direction) {
			if( $scope.displayNr < $scope.displayedQuestions.length  )
				$scope.displayedQuestions[$scope.displayNr].active = false;
			
			$scope.displayNr += direction;
			$scope.displayedQuestions[$scope.displayNr].active = true;
		}
		
		
		// Go through conditions if question display conditions
		// were satisfied. 
		function canDisplay(question) 
		{
			
			var matchedDependecies = 0;
			
			// All conditions should be satisfied (and logical operation)
			for(var i = 0; i < question.dependencies.length; i++) {
				var dep = question.dependencies[i];
				
				// If previous questions has an ID 0, means always display
				if(dep.previusQuestionID == 0)
					return true;
				
				else
					// Go through all answered questions
					for(var j = 0; j < that.answered.length; j++) {
						// Match question dependeny to already answered questions
						// Skip if not found
						if(that.answered[j].questionId !== dep.previusQuestionID)
							continue;
							
						// if matched and answerID == 0, match any as in question ID
						// also match in specific question dependecy matches
						if(dep.answerID == 0 ||							
						   that.answered[j].answerId == dep.answerID)
							matchedDependecies++;
					}
			}
			
			// If all conditions were met, return true, otherwise false.
			return question.dependencies.length <= matchedDependecies;
		}
		
		that.addedQuestions = [];
		$scope.back = function() 
		{
			if($scope.displayNr <= 0)
				return;
			
			for(var i = 0; i < that.addedQuestions[that.addedQuestions.length -1].questions; i++)
			{
				/*
				var q = $scope.displayedQuestions[$scope.displayedQuestions.length-1];
				for(var j = 0; j < q.answers.length; j++)
					q.answers[j].selected = false;
				*/
				
				that.questions.push($scope.displayedQuestions[$scope.displayedQuestions.length-1]);
				$scope.displayedQuestions.pop();
			}
			
			for(var i = 0; i < that.addedQuestions[that.addedQuestions.length -1].answers; i++)
				that.answered.pop();
			
			that.addedQuestions.pop();
			
			changeQuestion(-1);
		}
		
		$scope.diagnosis = -1;
		
		function end()
		{
			var colors = [0, 0, 0, 0, 0];
			
			for(var i = 0; i < $scope.displayedQuestions.length; i++) {
				var q = $scope.displayedQuestions[i];
				
				for(var j = 0; j < q.answers.length; j++)
				{					
					if(!q.answers[i])
						continue;
					
					colors[q.answers[i].flag]++;
					break;
				}
			}
			
			// 0 = no colour
			// 1 = green
			// 2 = yellow
			// 3 = red
			// 4 = purple
			// ! Purple danger is less then red.
			if(colors[4] >= 3 || colors[3])
				$scope.diagnosis = 3;
			else if(colors[4] >= 1 || colors[2] > 0)
				$scope.diagnosis = 2;
			else
				$scope.diagnosis = 1;
			
			switch($scope.diagnosis)
			{
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
			}
		}
		
		$scope.next = function() 
		{		
			// Save all asnwers from current question
			that.addedQuestions.push({ questions: 0, answers: 0 });
			if($scope.displayedQuestions.length > 0)
			{
				var q = $scope.displayedQuestions[$scope.displayNr];
				
				// Remove all questions for current question to prevent duplicates.
				for(var i = 0; i < that.answered.length; i++)
					if(that.answered[i].questionId == q.id)
						that.answered.splice(i--, 1);
				
				// Go through every possible answers, check if it's answered
				// and save it to answerd array
				if(q.type == 2)
				{
					for(var i = 0; i < q.answers.length; i++)
						if(q.answers[i].selected) 
						{
							that.answered.push({
								questionId: q.id,
								answerId: q.answers[i].answerID
							});
							that.addedQuestions[that.addedQuestions.length-1].answers++;
						}
				}
				else 
				{
					that.answered.push({
						questionId: q.id,
						answerId: q.answerNr
					});
					that.addedQuestions[that.addedQuestions.length-1].answers++;
				}
			}
			
			// Find all questions that should be displayed afterwards
			// Delete it from all questions
			for(var i = 0; i < that.questions.length; i++) {
				if(canDisplay(that.questions[i])) 
				{
					$scope.displayedQuestions.push(that.questions[i]);
					that.questions.splice(i--, 1);
					that.addedQuestions[that.addedQuestions.length-1].questions++;
				}
			}
			
			// No more questions left to display
			if($scope.displayedQuestions.length == $scope.displayNr+1)
				end();
			else // Otherwise sort questions and display
				$scope.displayedQuestions.sort(function (a, b) {
					return a.sequence -  b.sequence;
				});
				
			// Move to next question
			if($scope.displayNr < $scope.displayedQuestions.length-1)
				changeQuestion(+1);
		}
		
		// Call service to get all questions
		aspoService.getQuestions().then(function (questions) {
			// Add property to indicate which one is showed
			// Required for Bootstrap UI Carousel
			for(var i = 0; i < questions.length; i++) {
				questions[i].active = false;
				questions[i].answerNr = -1;
				
				for(var j = 0; j < questions[i].answers.length; j++)
					questions[i].answers[j].selected = false;
			}
				
			// Sort based on display order
			$scope.displayedQuestions.sort(function (a, b) {
				return a.sequence - b.sequence;
			});
			
			// Mark first one as active and save all
			// questions in controller property variable.
			questions[0].active = true;
			$scope.displayNr = 0;
			that.questions = questions;
			
			// Find and display first questions
			$scope.next();
			changeQuestion(-1);
		});
	}]);
})();