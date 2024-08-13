document.addEventListener('DOMContentLoaded', function () {
    const scheduleList = document.getElementById('scheduleList');
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    const saveScheduleBtn = document.getElementById('saveScheduleBtn');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const videoUrlInput = document.getElementById('videoUrl');

    let schedules = JSON.parse(localStorage.getItem('schedules')) || [];

    // Function to render the schedule list in the UI
    function renderSchedules() {
        scheduleList.innerHTML = '';
        schedules.forEach((schedule, index) => {
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            scheduleItem.innerHTML = `
                <span>${schedule.start_time} - ${schedule.end_time}: <a href="${schedule.video_url}" target="_blank">${schedule.video_url}</a></span>
                <button onclick="deleteSchedule(${index})">Delete</button>
            `;
            scheduleList.appendChild(scheduleItem);
        });
    }

    // Event listener for adding a new schedule
    addScheduleBtn.addEventListener('click', () => {
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const videoUrl = videoUrlInput.value;

        if (startTime && endTime && videoUrl) {
            schedules.push({ start_time: startTime, end_time: endTime, video_url: videoUrl });
            renderSchedules();
            startTimeInput.value = '';
            endTimeInput.value = '';
            videoUrlInput.value = '';
        } else {
            alert('Please fill out all fields');
        }
    });

    // Event listener for saving the schedules to localStorage
    saveScheduleBtn.addEventListener('click', () => {
        localStorage.setItem('schedules', JSON.stringify(schedules));
        alert('Schedule saved successfully!');
    });

    // Function to delete a schedule from the list
    window.deleteSchedule = function (index) {
        schedules.splice(index, 1);
        renderSchedules();
    };

    // Render schedules when the page loads
    renderSchedules();
});