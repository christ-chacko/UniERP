# UniERP – College ERP Mobile App (React Native + Supabase)

UniERP is a modern mobile ERP system built for colleges/universities — supporting Admin, Faculty, and Student workflows.
Includes Attendance, Notices, Chat/Servers (Discord-style), Fees, Results, Authentication & Role-based access.

## Demo Login Credentials

Use these accounts to test the app functionalities:

Admin
Email: admin4@erp.com
Password: 12345678

Faculty
Email: prof_varnika@erp.com
Password: 12345678

Student – CSE 1st Sem, Section A
Email: aryan.mehta@erp.com
Email: shaan.verma@erp.com
Password: 12345678

## Demo Flow 

Very quick test plan:

Login as Admin → create server & channel

Login as Faculty → mark attendance

Login as Student → view attendance calendar

Check notices, chat, and role-based dashboards

## Features Overview
### Student

View attendance (calendar UI + %)

View fees, results, notices

Role-based dashboard

### Faculty

Mark attendance (daily)

Create servers + channels (chat)

Send notices

Role-based permissions

### Admin

Full control of the system

Create servers/channels

Manage attendance & users

Chat System (Discord-like)

Servers → Channels → Messages

Realtime Supabase subscriptions

Role-based permissions

## Tech Stack

React Native (Expo SDK 53)

Supabase Auth & Database

Realtime Subscriptions

React Navigation

Expo Image Picker

react-native-calendars

## Running the Project

Clone the repo:

git clone <repo-url>
cd UniERP


Install dependencies:

npm install


Start Expo:

npm run start


Add your Supabase URL + Key in:

/src/services/supabaseClient.js


Run on device or emulator:

npm run android

## Screenshots 


Login Screen

![WhatsApp Image 2025-11-26 at 6 06 49 PM](https://github.com/user-attachments/assets/826fdce3-43f7-46eb-856b-20639b9087a4)


Notice Board

![WhatsApp Image 2025-11-26 at 6 06 26 PM](https://github.com/user-attachments/assets/51abe2c7-5a8a-4501-abb8-bf84b418b9a2)


Post Notice Screen (Admin/Faculty Roles)

![WhatsApp Image 2025-11-26 at 6 06 27 PM](https://github.com/user-attachments/assets/42fbfa01-7dd4-46a4-bd5e-2f09d4beec8d)


Chat(Servers and channels) Screen

![WhatsApp Image 2025-11-26 at 6 06 27 PM (1)](https://github.com/user-attachments/assets/bbbdf257-7a38-4657-ad45-02c0f821f95e)


Channel Creation modal

![WhatsApp Image 2025-11-26 at 6 14 00 PM](https://github.com/user-attachments/assets/5872a5d8-be82-44df-94b4-e90fd6cd09b4)


Server Creation modal

![WhatsApp Image 2025-11-26 at 6 14 00 PM (1)](https://github.com/user-attachments/assets/afd0a16f-c91f-4ab4-a7c5-f56332ccc424)


Dashboard Screen

![WhatsApp Image 2025-11-26 at 6 06 27 PM (2)](https://github.com/user-attachments/assets/9ae0977d-9ef8-4255-afa5-8a8a471114e2)


Attendance Batch Selection Screen (Admin/Faculty Roles)

![WhatsApp Image 2025-11-26 at 6 06 28 PM](https://github.com/user-attachments/assets/ba076b43-4c19-4e04-a021-5410ec314e79)


Mark attendance screen (Admin/Faculty Roles)

![WhatsApp Image 2025-11-26 at 6 06 28 PM (1)](https://github.com/user-attachments/assets/c891147a-2873-4051-a5df-cc4caa28f6c6)


Attendance Subject Selection and Calendar view  (Students)

![WhatsApp Image 2025-11-26 at 6 06 28 PM (2)](https://github.com/user-attachments/assets/589300d9-de1e-46e6-a6f3-cf1b15fc536a)












