class SpinningWheelCalendar {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        // Wheel configuration
        this.outerRadius = 220;
        this.middleRadius = 145;
        this.innerRadius = 70;
        
        // Rotation angles (in radians)
        this.dateRotation = 0;
        this.monthRotation = 0;
        this.yearRotation = 0;
        
        // Data
        this.months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.dates = Array.from({ length: 31 }, (_, i) => i + 1);
        this.years = Array.from({ length: 51 }, (_, i) => 2000 + i);
        
        // Mouse tracking
        this.isDragging = false;
        this.dragStartY = 0;
        this.dragStartRotation = 0;
        this.currentDragWheel = null;
        
        // Colors
        this.colors = {
            dateWheel: '#FF6B6B',
            monthWheel: '#4ECDC4',
            yearWheel: '#45B7D1',
            text: '#FFFFFF',
            background: '#F7F7F7'
        };
        
        this.setupEventListeners();
        this.updateDisplay();
        this.draw();
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', () => this.onMouseUp());
        
        // Touch support
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        document.addEventListener('touchmove', (e) => this.onTouchMove(e));
        document.addEventListener('touchend', () => this.onMouseUp());
    }
    
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.centerX;
        const y = e.clientY - rect.top - this.centerY;
        const distance = Math.sqrt(x * x + y * y);
        
        this.isDragging = true;
        this.dragStartY = e.clientY;
        
        if (distance < this.innerRadius) {
            this.currentDragWheel = 'year';
            this.dragStartRotation = this.yearRotation;
        } else if (distance < this.middleRadius) {
            this.currentDragWheel = 'month';
            this.dragStartRotation = this.monthRotation;
        } else if (distance < this.outerRadius) {
            this.currentDragWheel = 'date';
            this.dragStartRotation = this.dateRotation;
        }
    }
    
    onMouseMove(e) {
        if (!this.isDragging || !this.currentDragWheel) return;
        
        const deltaY = e.clientY - this.dragStartY;
        const rotation = deltaY * 0.01;
        
        if (this.currentDragWheel === 'date') {
            this.dateRotation = this.dragStartRotation + rotation;
        } else if (this.currentDragWheel === 'month') {
            this.monthRotation = this.dragStartRotation + rotation;
        } else if (this.currentDragWheel === 'year') {
            this.yearRotation = this.dragStartRotation + rotation;
        }
        
        this.updateDisplay();
        this.draw();
    }
    
    onMouseUp() {
        this.isDragging = false;
        this.currentDragWheel = null;
    }
    
    onTouchStart(e) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left - this.centerX;
        const y = touch.clientY - rect.top - this.centerY;
        const distance = Math.sqrt(x * x + y * y);
        
        this.isDragging = true;
        this.dragStartY = touch.clientY;
        
        if (distance < this.innerRadius) {
            this.currentDragWheel = 'year';
            this.dragStartRotation = this.yearRotation;
        } else if (distance < this.middleRadius) {
            this.currentDragWheel = 'month';
            this.dragStartRotation = this.monthRotation;
        } else if (distance < this.outerRadius) {
            this.currentDragWheel = 'date';
            this.dragStartRotation = this.dateRotation;
        }
    }
    
    onTouchMove(e) {
        if (!this.isDragging || !this.currentDragWheel) return;
        
        const touch = e.touches[0];
        const deltaY = touch.clientY - this.dragStartY;
        const rotation = deltaY * 0.01;
        
        if (this.currentDragWheel === 'date') {
            this.dateRotation = this.dragStartRotation + rotation;
        } else if (this.currentDragWheel === 'month') {
            this.monthRotation = this.dragStartRotation + rotation;
        } else if (this.currentDragWheel === 'year') {
            this.yearRotation = this.dragStartRotation + rotation;
        }
        
        this.updateDisplay();
        this.draw();
    }
    
    getSelectedIndex(rotation, arrayLength) {
        let angle = -rotation;
        angle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const segmentAngle = (Math.PI * 2) / arrayLength;
        const index = Math.round(angle / segmentAngle) % arrayLength;
        return index;
    }
    
    getSelectedValues() {
        const dateIndex = this.getSelectedIndex(this.dateRotation, this.dates.length);
        const monthIndex = this.getSelectedIndex(this.monthRotation, this.months.length);
        const yearIndex = this.getSelectedIndex(this.yearRotation, this.years.length);
        
        const date = this.dates[dateIndex];
        const month = this.months[monthIndex];
        const year = this.years[yearIndex];
        
        return { date, month, year, dateIndex, monthIndex, yearIndex };
    }
    
    updateDisplay() {
        const { date, month, year, monthIndex } = this.getSelectedValues();
        
        // Create a date object for day of week calculation
        const dateObj = new Date(year, monthIndex, date);
        const dayName = this.days[dateObj.getDay()];
        
        // Validate date (handle cases like Feb 30)
        if (dateObj.getMonth() !== monthIndex) {
            dateObj.setDate(0);
        }
        
        const dateString = `${month} ${date}, ${year}`;
        
        document.getElementById('dayName').textContent = dayName;
        document.getElementById('dateValue').textContent = dateString;
        document.getElementById('monthValue').textContent = month;
        document.getElementById('dateNumValue').textContent = String(date).padStart(2, '0');
        document.getElementById('yearValue').textContent = year;
        document.getElementById('dayOfWeekValue').textContent = dayName;
    }
    
    drawWheel(rotation, radius, items, color, isSelectorWheel) {
        const segmentAngle = (Math.PI * 2) / items.length;
        
        items.forEach((item, index) => {
            const startAngle = rotation + index * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const midAngle = (startAngle + endAngle) / 2;
            
            // Draw segment background
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            
            const opacity = Math.abs(Math.cos((midAngle + Math.PI / 2))) * 0.3 + 0.7;
            this.ctx.fillStyle = this.adjustOpacity(color, opacity);
            this.ctx.fill();
            
            // Draw segment border
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // Draw text
            const textRadius = radius * 0.75;
            const x = this.centerX + Math.cos(midAngle) * textRadius;
            const y = this.centerY + Math.sin(midAngle) * textRadius;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(midAngle + Math.PI / 2);
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(String(item), 0, 0);
            this.ctx.restore();
        });
    }
    
    adjustOpacity(color, opacity) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw wheels (outer to inner)
        this.drawWheel(this.dateRotation, this.outerRadius, this.dates, this.colors.dateWheel);
        this.drawWheel(this.monthRotation, this.middleRadius, this.months, this.colors.monthWheel);
        this.drawWheel(this.yearRotation, this.innerRadius, this.years, this.colors.yearWheel);
        
        // Draw center circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 40, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
        this.ctx.strokeStyle = '#DDD';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw center text
        this.ctx.fillStyle = '#999';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('SPIN', this.centerX, this.centerY - 10);
        this.ctx.font = '10px Arial';
        this.ctx.fillText('ME', this.centerX, this.centerY + 8);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpinningWheelCalendar();
});
