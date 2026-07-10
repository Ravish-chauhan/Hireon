const { google } = require("googleapis");
require("dotenv").config();

//  Initialize OAuth2 Client using environment variables
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

//  Set the refresh token to auto-renew access tokens
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

//  Create Google Calendar instance
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

/* ======================================================
    Create a calendar event for a consultation
   ------------------------------------------------------
   Automatically creates Google Meet link + sends email
   ====================================================== */
async function createConsultationEvent(consultation) {
  try {
    const event = {
      summary: consultation.summary,
      description: consultation.description || "Edunia Consultation Meeting",
      start: {
        dateTime: consultation.startDateTime,
        timeZone: consultation.timeZone || "Asia/Kolkata",
      },
      end: {
        dateTime: consultation.endDateTime,
        timeZone: consultation.timeZone || "Asia/Kolkata",
      },
      attendees: [
        { email: consultation.consultantEmail }, // consultant calendar
        { email: consultation.studentEmail }, // student email
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`, // generates a unique Meet link
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all", // sends email notifications
    });

    console.log("✅ Event created successfully:", response.data.hangoutLink);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating calendar event:", error.message);
    throw new Error("Failed to create Google Calendar event");
  }
}

/* ======================================================
    Delete an existing event
   ====================================================== */
async function deleteConsultationEvent(eventId) {
  try {
    const response = await calendar.events.delete({
      calendarId: "primary",
      eventId,
      sendUpdates: "all", //  notifies all attendees via email
    });

    console.log(`🗑️ Event ${eventId} deleted and attendees notified`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting calendar event:", error.message);
    throw new Error("Failed to delete Google Calendar event");
  }
}


/* ======================================================
    Update Google Calendar event (reschedule)
   ====================================================== */
async function updateConsultationEvent(eventId, startDateTime, endDateTime) {
  try {
    const response = await calendar.events.patch({
      calendarId: "primary",
      eventId,
      sendUpdates: "all", //  this ensures both attendees get updated email
      requestBody: {
        start: { dateTime: startDateTime.toISOString(), timeZone: "Asia/Kolkata" },
        end: { dateTime: endDateTime.toISOString(), timeZone: "Asia/Kolkata" },
        description: `Consultation rescheduled to ${startDateTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
      },
    });

    console.log(`✅ Rescheduled event ${eventId} successfully`);
    return response.data;
  } catch (err) {
    console.error("❌ Error updating event:", err.message);
    throw err;
  }
}

/* ======================================================
    Check if a specific time slot is free
   ------------------------------------------------------
   Used in: POST /book
   Logic: Calls Google Calendar freebusy API
   ====================================================== */
async function isSlotAvailable(startISO, endISO) {
  try {
    console.log("🔍 Checking Google Calendar slot:", startISO, "→", endISO);

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startISO,
        timeMax: endISO,
        timeZone: "Asia/Kolkata",
        items: [{ id: "primary" }],
      },
    });

    const busy = response.data.calendars.primary.busy || [];

    //  Half-open interval logic
    const requestedStart = new Date(startISO);
    const requestedEnd = new Date(endISO);

    const conflict = busy.some((b) => {
      const busyStart = new Date(b.start);
      const busyEnd = new Date(b.end);
      // overlap only if busyStart < requestedEnd && busyEnd > requestedStart
      return busyStart < requestedEnd && busyEnd > requestedStart;
    });

    const isFree = !conflict;

    console.log(isFree ? "✅ Slot available" : "⛔ Slot busy (overlap found)");
    return isFree;
  } catch (error) {
    console.error("❌ Error checking slot availability:", error.message);
    return false;
  }
}

 

/* ======================================================
    Get all busy times for a specific day
   ------------------------------------------------------
   Used in: GET /available-slots
   Returns: Array of { start, end } ISO strings
   ====================================================== */
async function getGoogleBusyTimes(date) {
  try {
    const startOfDay = new Date(`${date}T00:00:00+05:30`).toISOString();
    const endOfDay = new Date(`${date}T23:59:59+05:30`).toISOString();

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay,
        timeMax: endOfDay,
        timeZone: "Asia/Kolkata",
        items: [{ id: "primary" }],
      },
    });

    const busyPeriods = response.data.calendars.primary.busy || [];
    console.log(`📅 Found ${busyPeriods.length} busy periods for ${date}`);

    // Return array of readable times (optional conversion)
    return busyPeriods.map((b) => ({
      start: b.start,
      end: b.end,
    }));
  } catch (error) {
    console.error("❌ Error fetching busy times:", error.message);
    return [];
  }
}

/* ======================================================
    Export all functions
   ====================================================== */
module.exports = {
  createConsultationEvent,
  deleteConsultationEvent,
  updateConsultationEvent,
  isSlotAvailable,
  getGoogleBusyTimes,
};
