import tkinter as tk
import time
from datetime import datetime
import math
import pytz

# Check if a given year is a leap year
def is_leap_year(year):
    if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
        return True
    return False

# Convert Unix time to custom calendar format
def unix_to_custom_time(unix_time):
    # Get the current local time
    local_time = datetime.now()
    
    # Extract year, day of the year, and the time components
    year = local_time.year + 10000
    day_of_year = local_time.timetuple().tm_yday
    hour = local_time.hour
    minute = local_time.minute
    second = local_time.second
    
    # Adjust for leap year
    if is_leap_year(year - 10000):
        total_days_in_year = 366
    else:
        total_days_in_year = 365
    
    # Determine the month and day in custom calendar
    if day_of_year <= 360:
        month = (day_of_year - 1) // 36 + 1
        day = (day_of_year - 1) % 36 + 1
        day_out_of_month = False
    else:
        month = 0
        day = day_of_year - 360
        day_out_of_month = True
    
    # Convert to custom time
    total_seconds = hour * 3600 + minute * 60 + second
    custom_hour = total_seconds / 8640
    custom_minute = (total_seconds % 8640) / 86.4
    custom_second = (total_seconds % 86.4) / 0.864
    
    # Month names
    month_names = ["Premaber", "Duember", "Trimber", "Quadober", "Quintumber", 
                   "Sextamber", "September", "Octimber", "Novomber", "Decumber"]
    
    # Format the custom date
    if day_out_of_month:
        custom_date = f"Day {day}, {year}"
    else:
        custom_date = f"{month_names[month-1]} {day}, {year}"
    
    # Format the custom time
    custom_time = f"{int(custom_hour):02d}:{int(custom_minute):02d}:{int(custom_second):02d}"
    
    return custom_date, custom_time, custom_hour, custom_minute, custom_second

class CustomClock:
    def __init__(self, root):
        self.root = root
        self.root.title("Time2-o-matic")
        self.label = tk.Label(root, font=('Arial', 16), bg='black', fg='white')
        self.label.pack()
        self.canvas = tk.Canvas(root, width=400, height=400, bg='black')
        self.canvas.pack()
        self.center = 200
        self.radius = 180
        self.update_clock()
    
    def draw_clock_face(self):
        # Draw the clock face
        for i in range(10):
            angle = math.radians(i * 36)
            x = self.center + self.radius * math.sin(angle)
            y = self.center - self.radius * math.cos(angle)
            self.canvas.create_text(x, y, text=str(i), font=('Arial', 22), fill='white')
        
        for i in range(100):
            angle = math.radians(i * 3.6)
            x_start = self.center + (self.radius - 10) * math.sin(angle)
            y_start = self.center - (self.radius - 10) * math.cos(angle)
            x_end = self.center + self.radius * math.sin(angle)
            y_end = self.center - self.radius * math.cos(angle)
            self.canvas.create_line(x_start, y_start, x_end, y_end, fill='white')
    
    def update_clock(self):
        self.canvas.delete('hands')
        unix_time = time.time()
        custom_date, custom_time, custom_hour, custom_minute, custom_second = unix_to_custom_time(unix_time)
        
        self.label.config(text=f"{custom_date}; {custom_time}")
        
        self.draw_clock_hand(custom_hour / 10 * 360, self.radius * 0.5, 'red')
        self.draw_clock_hand(custom_minute / 100 * 360, self.radius * 0.75, 'blue')
        self.draw_clock_hand(custom_second / 100 * 360, self.radius * 0.9, 'green')
        
        self.root.after(1000, self.update_clock)
    
    def draw_clock_hand(self, angle_degrees, length, color):
        angle = math.radians(angle_degrees - 90)
        x_end = self.center + length * math.cos(angle)
        y_end = self.center + length * math.sin(angle)
        self.canvas.create_line(self.center, self.center, x_end, y_end, fill=color, width=2, tag='hands')

if __name__ == "__main__":
    root = tk.Tk()
    clock = CustomClock(root)
    clock.draw_clock_face()
    root.mainloop()
