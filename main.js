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
        var currentDate = new Date()
        var currentTime = currentDate.toTimeString().split(' ')[0];
        var currentTimeDate = new Date('2000-01-01T' + currentTime);
        var targetTimeDateBefore = new Date('2000-01-01T' + targetTime);
        var currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
        // Subtract 8 seconds from targetTimeDate
        targetTimeDateBefore.setSeconds(targetTimeDateBefore.getSeconds() - 8);
        if (currentTimeDate.getTime() === targetTimeDateBefore.getTime()) {
                var backupDates = [];
                var backupDate = new Date(currentDate);
                backupDate.setDate(backupDate.getDate() + 3); // Add 3 days

                backupDate.setHours(21, 0, 0, 0); // Set the start time to 13:00:00

                for (var i = 0; i < 4; i++) { // set time interval to 4 block
                    backupDates.push(backupDate.toISOString().slice(0, 19).replace('T', ' '));
                    backupDate.setHours(backupDate.getHours() + 1); // Increment by 1 hour
                }
                localStorage.setItem('timeList', JSON.stringify(backupDates));
                console.log('Backup dates:', backupDates);
        }
        var isRefreshRequired = localStorage.getItem('refreshRequired');
        if (currentTime === targetTime) {
            if (isRefreshRequired !== 'true') {
                localStorage.setItem('refreshRequired', 'true');
                location.replace(location.href);

            }
        } if (isRefreshRequired) {
            if (currentDay === 5 || currentDay === 6) {
                // It's Friday (5) or Saturday (6)
                //doGenerateNextWeekAppointmentTimes('e39418c7-53ed-44fa-9eab-c8852952d219')
                doGenerateNextWeekAppointmentTimes('3ed8b475-ef1a-40d3-b991-4518cd48d855')

            }
            //
            setTimeout(function () {
                localStorage.removeItem('refreshRequired');
                var isSubmitClicked = false;
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

                }
                var nextStepButton = document.getElementById("nextStep");
                nextStepButton.click()
                function checkAndFillInput() {
                    var sampleCountInput = document.getElementById("SampleCount");
                    if (sampleCountInput) {
                        sampleCountInput.value = "1"; //
                        var nextStepButton2 = document.getElementById("nextStep2");
                        nextStepButton2.click()
                        clearInterval(interval);
                        interval2 = setTimeout(lastStep, 200);
                    }
                }
                var interval = setInterval(checkAndFillInput, 200);
                function lastStep() {
                    if (isSubmitClicked) return;
                    var spans = document.querySelectorAll('span');
                    for (var i = 0; i < spans.length; i++) {
                        var span = spans[i];
                        if (span.textContent.includes("我已仔细阅读并同意以上条款")) {
                            span.click()
                            setTimeout(function () {
                                var nextStepButton3 = document.getElementById("submitBooking");
                                nextStepButton3.click()
                                isSubmitClicked = true;
                                clearInterval(interval2);
                            }, 100);
                            setTimeout(function () {
                                location.reload();
                            }, 9800);
                            break;
                        }
                    }
                }

            }, 500)

        }
    }
    setInterval(checkTimeAndAct, 1000);
})();
