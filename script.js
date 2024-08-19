document.addEventListener('DOMContentLoaded', () => {
    const scheduleGrid = document.getElementById('scheduleGrid');
    const scheduleCards = document.getElementById('scheduleCards');
    const formModal = document.getElementById('formModal');
    const previewModal = document.getElementById('previewModal');
    const previewDetails = document.getElementById('previewDetails');
    const datePicker = document.getElementById('datePicker');
    const updateScheduleGridBtn = document.getElementById('updateScheduleGrid');
    
    let schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    let selectedDate = new Date(); // Default to current date

    function renderScheduleGrid(date) {
        const slots = [];
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        
        while (start < end) {
            const slotStart = new Date(start);
            const slotEnd = new Date(start);
            slotEnd.setMinutes(slotEnd.getMinutes() + 45);
            
            const isScheduled = schedules.some(schedule => {
                const scheduleStart = new Date(schedule.startTime);
                const scheduleEnd = new Date(schedule.endTime);
                return (scheduleStart <= slotStart && scheduleEnd > slotStart) || 
                       (scheduleStart < slotEnd && scheduleEnd >= slotEnd);
            });

            slots.push({
                start: slotStart,
                end: slotEnd,
                isScheduled
            });
            
            start.setMinutes(start.getMinutes() + 45);
        }

        scheduleGrid.innerHTML = slots.map(slot => `
            <div class="schedule-slot ${slot.isScheduled ? 'scheduled' : 'empty'}" 
                data-start="${slot.start.toISOString()}" 
                data-end="${slot.end.toISOString()}">
                ${formatDate(slot.start)} - ${formatDate(slot.end)}
                ${!slot.isScheduled ? '<br>No Schedule in this Slot<br><button onclick="openAddScheduleForm(\'' + slot.start.toISOString() + '\', \'' + slot.end.toISOString() + '\')">Add Schedule</button>' : ''}
            </div>
        `).join('');
    }

    function renderScheduleCards() {
        scheduleCards.innerHTML = schedules.map((schedule, index) => `
            <div class="schedule-card">
                <h3>${schedule.title}</h3>
                <p><strong>Speaker:</strong> ${schedule.speakerName}</p>
                <p><strong>Video URL:</strong> <a href="${schedule.videoUrl}" target="_blank">${schedule.videoUrl}</a></p>
                <p><strong>Start Time:</strong> ${formatDate(new Date(schedule.startTime))}</p>
                <p><strong>End Time:</strong> ${formatDate(new Date(schedule.endTime))}</p>
                <img src="${schedule.thumbnailUrl}" alt="Thumbnail">
                <div class="schedule-actions">
                    <button onclick="openEditScheduleForm(${index})">Edit</button>
                    <button class="delete" onclick="deleteSchedule(${index})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    window.openAddScheduleForm = (startTime, endTime) => {
        document.getElementById('modalStartTime').value = formatDate(new Date(startTime), true);
        document.getElementById('modalEndTime').value = formatDate(new Date(endTime), true);
        document.getElementById('modalTitle').value = '';
        document.getElementById('modalSpeakerName').value = '';
        document.getElementById('modalVideoUrl').value = '';
        document.getElementById('modalSaveScheduleBtn').onclick = () => saveSchedule(startTime, endTime);
        openModal('formModal');
    }

    window.openEditScheduleForm = (index) => {
        const schedule = schedules[index];
        document.getElementById('modalStartTime').value = formatDate(new Date(schedule.startTime), true);
        document.getElementById('modalEndTime').value = formatDate(new Date(schedule.endTime), true);
        document.getElementById('modalTitle').value = schedule.title;
        document.getElementById('modalSpeakerName').value = schedule.speakerName;
        document.getElementById('modalVideoUrl').value = schedule.videoUrl;
        document.getElementById('modalSaveScheduleBtn').onclick = () => updateSchedule(index);
        openModal('formModal');
    }

    window.deleteSchedule = (index) => {
        schedules.splice(index, 1);
        localStorage.setItem('schedules', JSON.stringify(schedules));
        renderScheduleGrid(selectedDate);
        renderScheduleCards();
    }

    function saveSchedule(startTime, endTime) {
        const title = document.getElementById('modalTitle').value;
        const speakerName = document.getElementById('modalSpeakerName').value;
        const videoUrl = document.getElementById('modalVideoUrl').value;
        const thumbnailUrl = `https://img.youtube.com/vi/${getVideoId(videoUrl)}/0.jpg`;
        
        if (title && speakerName && videoUrl && startTime && endTime) {
            schedules.push({
                title,
                speakerName,
                videoUrl,
                startTime,
                endTime,
                thumbnailUrl
            });
            localStorage.setItem('schedules', JSON.stringify(schedules));
            renderScheduleGrid(selectedDate);
            renderScheduleCards();
            closeModal('formModal');
        } else {
            alert('Please fill out all fields.');
        }
    }

    function updateSchedule(index) {
        const title = document.getElementById('modalTitle').value;
        const speakerName = document.getElementById('modalSpeakerName').value;
        const videoUrl = document.getElementById('modalVideoUrl').value;
        const startTime = document.getElementById('modalStartTime').value;
        const endTime = document.getElementById('modalEndTime').value;
        const thumbnailUrl = `https://img.youtube.com/vi/${getVideoId(videoUrl)}/0.jpg`;

        if (title && speakerName && videoUrl && startTime && endTime) {
            schedules[index] = {
                title,
                speakerName,
                videoUrl,
                startTime,
                endTime,
                thumbnailUrl
            };
            localStorage.setItem('schedules', JSON.stringify(schedules));
            renderScheduleGrid(selectedDate);
            renderScheduleCards();
            closeModal('formModal');
        } else {
            alert('Please fill out all fields.');
        }
    }

    function getVideoId(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)?([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : '';
    }

    function formatDate(date, inputFormat = false) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return inputFormat ? 
            `${year}-${month}-${day}T${hours}:${minutes}` : 
            `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    function openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }

    function closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // Update the schedule grid based on the selected date
    updateScheduleGridBtn.addEventListener('click', () => {
        const selectedDateValue = datePicker.value;
        if (selectedDateValue) {
            selectedDate = new Date(selectedDateValue);
            renderScheduleGrid(selectedDate);
        } else {
            alert('Please select a date.');
        }
    });

    renderScheduleGrid(selectedDate);
    renderScheduleCards();
});
