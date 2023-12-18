// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Snatch Laboratory Equipment from Bynonco.com
// @author       Taitan Pascal
// @match        http://dypt.ujs.edu.cn/console/appointment/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// ==/UserScript==

// 设置需要点击的时间点
var targetTime = '23:59:59';

var timeList = []
var timeListData = localStorage.getItem('timeList');
var interval2 = null;
if (timeListData) {
    timeList = JSON.parse(timeListData);
}
(function () {
    'use strict';
    function checkTimeAndAct() {
        var currentTime = new Date().toTimeString().split(' ')[0];
        var currentTimeDate = new Date('2000-01-01T' + currentTime);
        var targetTimeDateBefore = new Date('2000-01-01T' + targetTime);
        // Subtract 8 seconds from targetTimeDate
        targetTimeDateBefore.setSeconds(targetTimeDateBefore.getSeconds() - 8);
        if (currentTimeDate.getTime() === targetTimeDateBefore.getTime()) {
            fetch('http://74.48.115.131:5000/times')
                .then(response => response.text())
                .then(data => {
                    // Split the response data into an array
                    var fetchedTimeList = data.split('\n');
                    fetchedTimeList = fetchedTimeList.filter(item => item.trim() !== '');
                    localStorage.setItem('timeList', JSON.stringify(fetchedTimeList));
                    console.log('timeList:', timeList);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

        }
        var isRefreshRequired = localStorage.getItem('refreshRequired');
        if (currentTime === targetTime) {
            if (isRefreshRequired !== 'true') {
                localStorage.setItem('refreshRequired', 'true');
                location.reload();
            }
        } else if (isRefreshRequired) {
            localStorage.removeItem('refreshRequired');
            var isSubmitClicked = false;
            console.log('timeList:', timeList);
            for (var i = 0; i < timeList.length; i++) {
                var time_step = timeList[i];
                var targetElement = document.getElementById(time_step);
                if (targetElement) {
                    var mouseDownEvent = new MouseEvent("mousedown", {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    targetElement.dispatchEvent(mouseDownEvent);
                }
                const sleep = ms => new Promise(r => setTimeout(r, 100));
            }
            var nextStepButton = document.getElementById("nextStep");
            nextStepButton.click()
            const sleep = ms => new Promise(r => setTimeout(r, 100));
            function checkAndFillInput() {
                var sampleCountInput = document.getElementById("SampleCount");
                if (sampleCountInput) {
                    sampleCountInput.value = "1"; // 填充为1
                    var nextStepButton2 = document.getElementById("nextStep2");
                    nextStepButton2.click()
                    clearInterval(interval);
                    interval2 = setInterval(lastStep, 800);
                }
            }
            var interval = setInterval(checkAndFillInput, 200);
            setTimeout(function () {
                location.reload();
            }, 8000);
            function lastStep() {
                if (isSubmitClicked) return;
                var spans = document.querySelectorAll('span');
                for (var i = 0; i < spans.length; i++) {
                    var span = spans[i];
                    if (span.textContent.includes("我已仔细阅读并同意以上条款")) {
                        span.click()
                        var nextStepButton3 = document.getElementById("submitBooking");
                        nextStepButton3.click()
                        setTimeout(function () {
                            isSubmitClicked = true;
                            clearInterval(interval2);
                        }, 800);
                        break;
                    }
                }
            }

        }
    }
    setInterval(checkTimeAndAct, 1000);
})();