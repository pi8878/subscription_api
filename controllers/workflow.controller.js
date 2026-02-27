// // functions that send reminders to users 

import dayjs from 'dayjs';
import {createRequire} from 'module';
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express');

const REMINDERS = [7, 5, 2, 1]; // days before renewal date to send reminders

export const sendReminders = serve(async (context) => {
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())){
        console.log(`Renewal date for subscription ${subscription._id} has passed. Stopping workflow.`);
        return;
    }

    for (const daysBefore of REMINDERS){
        // for example, if renewal date is 10th Jan and daysBefore is 7, reminder date will be 3rd Jan. If today is 3rd Jan, send reminder
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if(dayjs().isSame(reminderDate, 'day')){
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
});

const fetchSubscription = async(context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntilReminder = async(context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async(context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    })
}

// import dayjs from 'dayjs';
// import { createRequire } from 'module';
// import Subscription from '../models/subscription.model.js';
// import { sendReminderEmail } from '../utils/send-email.js';

// const require = createRequire(import.meta.url);
// const { serve } = require('@upstash/workflow/express');

// const REMINDERS = [7, 5, 2, 1];

// export const sendReminders = serve(async (context) => {
//     const { subscriptionId } = context.requestPayload;

//     // ✅ Pass context directly inline instead of separate function
//     const subscription = await context.run('get-subscription', async () => {
//         return Subscription.findById(subscriptionId).populate('user', 'name email');
//     });

//     if (!subscription || subscription.status !== 'active') return;

//     const renewalDate = dayjs(subscription.renewalDate);

//     if (renewalDate.isBefore(dayjs())) {
//         console.log(`Renewal date has passed. Stopping workflow.`);
//         return; // ✅ You were missing the return here too
//     }

//     for (const daysBefore of REMINDERS) {
//         const reminderDate = renewalDate.subtract(daysBefore, 'day');

//         if (reminderDate.isAfter(dayjs())) {
//             // ✅ context is available here since we're inside serve()
//             console.log(`Sleeping until ${daysBefore} days before reminder at ${reminderDate}`);
//             await context.sleepUntil(`reminder-${daysBefore}-days-before`, reminderDate.toDate());
//         }

//         // ✅ context.run inline instead of separate function
//         await context.run(`reminder-${daysBefore}-days-before`, async () => {
//             console.log(`Triggering ${daysBefore} days before reminder`);
//             await sendReminderEmail({
//                 to: subscription.user.email,
//                 type: `${daysBefore} days before`,
//                 subscription,
//             });
//         });
//     }
// });