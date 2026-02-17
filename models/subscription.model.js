import mongoose from "mongoose"; 

// Models let us how the data will be stored in the database and also provide us with methods to interact with the database.

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2, 
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number greater than or equal to 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'education', 'technology', 'finance', 'health', 'lifestyle', 'politics', 'travel', 'food', 'music', 'gaming', 'other'],
        required: [true, 'Category is required'],
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'paypal', 'bank_transfer', 'crypto', 'other'], //enum was not added in this version and not the OG code
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'canceled'],   //we could add pending later in the future
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past',
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value > this.startDate,
            message: 'Renewal date must be after the start date',
        }
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }

},{timestamps: true});


// Next we create auto subscription renewal logic function (only if date missing)

subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        // Calculate the renewal date based on the frequency and start date 
        // e.g. if frequency is monthly and start date is 1st Jan, renewal date will be 31st Jan (30 days later)
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // Auto-update the status to expired if the renewal date is in the past
    if(this.renewalDate < this.startDate){
        this.status = 'expired';
    }
    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
