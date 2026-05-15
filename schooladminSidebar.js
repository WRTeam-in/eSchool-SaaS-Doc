// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  schooladminSidebar: [
    "academy-setup-wizard",
    "dashboard",
    {
      type: "category",
      label: "Academic Management",
      items: [
        {
          type: "category",
          label: "Academics",
          items: [
            "academics/medium",
            "academics/section",
            "academics/subject",
            "academics/semester",
            "academics/stream",
            "academics/shift",
            "academics/class",
            "academics/syllabus",
            "academics/class-subject",
            "academics/class-section-teachers",
          ],
        },
        {
          type: "category",
          label: "Students",
          items: [
            "students/students-admission",
            "students/admission-inquiries",
            "students/student-details",
            "students/add-bulk-data",
            "students/guardian",
            "academics/assign-roll-number",
            "students/upload-profile-images",
            "students/assign-elective-subject",
            "students/transfer-student",
            "students/promote-students",
            "students/students-reset-password",
          ],
        },
        {
          type: "category",
          label: "Teacher",
          items: [
            "teachers/manage-teachers",
            "teachers/salary-structure",
            "teachers/bulk-upload-teachers"
          ],
        },
      ],
    },

    {
      type: "category",
      label: "Academic Calender",
      items: [
        {
          type: "category",
          label: "Timetable",
          items: ["timetable/create-timetable", "timetable/teacher-timetable"],
        },
        {
          type: "category",
          label: "Attendance",
          items: [
            "attendance/student-attendance",
            "attendance/month-wise-attendance",
          ],
        },
        "holiday-list",
      ],
    },
    {
      type: "category",
      label: "Exam & Performance",
      items: [
        {
          type: "category",
          label: "Assignment",
          items: ["assignment/assignment-submission"],
        },
        {
          type: "category",
          label: "Offline Exam",
          items: [
            "offline-exam/manage-offline-exam",
            "offline-exam/timetable",
            "offline-exam/track-exam-marks",
            "offline-exam/offline-exam-result",
            "offline-exam/exam-grade",
          ],
        },
        {
          type: "category",
          label: "Online Exam",
          items: [
            "online-exam/manage-online-exam",
            "online-exam/manage-questions",
            "online-exam/add-bulk-questions",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Communication & Media",
      items: [
        {
          type: "category",
          label: "Student Diary",
          items: ["student-diary/diary-category", "student-diary/student-diary"],
        },
        "notification",
        "announcement",
        "sliders",
        "gallery",
      ],
    },
    {
      type: "category",
      label: "Personnel Management",
      items: [
        {
          type: "category",
          label: "Staff Management",
          items: [
            "staff-management/role-permission",
            "staff-management/staff",
            "staff-management/bulk-upload-staffs",
          ],
        },
        {
          type: "category",
          label: "Staff Leave",
          items: ["staff-leave/staff-leave", "staff-leave/leave-report"],
        },
        "staff-attendance/staff-attendance",
        "tasks"
      ],
    },
    {
      type: "category",
      label: "Institutional Finance",
      items: [
        {
          type: "category",
          label: "Fees",
          items: [
            "fees/fees-type",
            "fees/manage-fees",
            "fees/fee-paid",
            "fees/optional-fees-log",
            "fees/fee-transaction-logs",
          ],
        },
        {
          type: "category",
          label: "Expense",
          items: ["expense/manage-expense-category", "expense/manage-expense"],
        },
        {
          type: "category",
          label: "Payroll",
          items: ["payroll/payroll", "payroll/payroll-settings"],
        },
      ],
    },
    {
      type: "category",
      label: "Transportation Module",
      items: [
        "transportation/transportation-module",
      ],
    },
    {
      type: "category",
      label: "Certificate & ID Card",
      items: [
        { type: "doc", id: "certificate-idcard/template", label: "Certificate Template" },
        { type: "doc", id: "certificate-idcard/assign-certificate", label: "Certificate Assign" },
        { type: "doc", id: "certificate-idcard/id-card-settings", label: "ID Card Settings" },
        { type: "doc", id: "certificate-idcard/student-id-card", label: "Student ID Card" },
        { type: "doc", id: "certificate-idcard/staff-id-card", label: "Staff ID Card" },
      ],
    },
    {
      type: "category",
      label: "Reports",
      items: [
        "reports/student-reports",
        "reports/teacher-reports",
        "reports/staff-reports",
        "reports/exam-reports",
        "reports/expense-report",
      ],
    },
    {
      type: "category",
      label: "Subscription & Plans",
      items: [
        { type: "doc", id: "subscription/subscription", label: "Subscription" },
        { type: "doc", id: "subscription/plans", label: "Plans" },
        { type: "doc", id: "subscription/addons", label: "Addons" },
      ],
    },
    {
      type: "category",
      label: "Settings",
      items: [
        {
          type: "category",
          label: "System Settings",
          items: [
            "system-settings/general-settings",
            { type: "doc", id: "manage-session-years", label: "Session Year" },
            "system-settings/leave-settings",
            "system-settings/additional-user-fields",
            "system-settings/online-exam-terms-condition",
            "system-settings/email-template",
            "system-settings/payment-settings",
            "system-settings/third-party-api",
            "system-settings/privacy-policy",
            "system-settings/terms-and-conditions",
            "system-settings/refund-cancellation",
            "system-settings/contact-us",
            "system-settings/about-us",
          ],
        },
        {
          type: "category",
          label: "Web Settings",
          items: [
            "web-settings/content",
            "web-settings/faqs",
          ],
        },
        "system-settings/database-backup",
      ],
    },
    "contact-inquiry",
    "support",
  ],
};

export default sidebars;
