import Goal from "../models/Goal.js";
import { sendEmailReminder } from "../utils/mailer.js";
import cron from 'node-cron';

const scheduleEmailReminders = () => {
    // Schedule the task to run every day at 9 AM
    cron.schedule('0 9 * * *', checkForUpcomingDeadlines);
};

const checkForUpcomingDeadlines = async () => {
    const today = new Date();
    const upcomingDate = new Date();
    upcomingDate.setDate(today.getDate() + 3); // Check for deadlines within the next 3 days

    try {
        const goals = await Goal.find({
            deadline: { $gte: today, $lte: upcomingDate },
        }).populate('userId'); // Ensure you populate userId to get email addresses

        for (const goal of goals) {
            const userEmail = goal.userId.email; // Assuming the User model has an email field
            const subject = `Reminder: Your goal deadline is approaching!`;
            const text = `Hello! This is a reminder that your goal of ${goal.type} is due on ${goal.deadline.toDateString()}. Current progress: ${goal.progress}/${goal.target}.`;

            await sendEmailReminder(userEmail, subject, text);
        }
    } catch (err) {
        console.error('Error checking deadlines:', err);
    }
};

// Start scheduling reminders when the controller is loaded
scheduleEmailReminders();

// Set a new goal
export const setGoal = async (req, res) => {
    const { userId, type, target, deadline } = req.body;

    // Validate incoming data
    if (!userId || !type || target == null || !deadline) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newGoal = new Goal({
            userId,
            type,
            target,
            progress: 0,
            deadline,
        });
        
        await newGoal.save();
        res.status(201).json({ message: 'Goal set successfully', goal: newGoal });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get goals for a specific user
export const getGoals = async (req, res) => {
    const { userId } = req.query;

    // Validate userId
    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        const goals = await Goal.find({ userId });
        
        if (goals.length === 0) {
            return res.status(404).json({ message: 'No goals found for this user' });
        }

        res.json(goals);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update progress of a goal
export const updateProgress = async (req, res) => {
    const { goalId, progress } = req.body;

    // Validate input
    if (!goalId || progress == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const goal = await Goal.findByIdAndUpdate(goalId, { progress }, { new: true });
        
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        res.json({ message: 'Progress updated successfully', goal });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  const { goalId } = req.params;
  console.log(goalId);
  // Validate input
  if (!goalId) {
      return res.status(400).json({ error: 'Missing goalId' });
  }

  try {
      const deletedGoal = await Goal.findByIdAndDelete(goalId);
      
      if (!deletedGoal) {
          return res.status(404).json({ message: 'Goal not found' });
      }

      res.json({ message: 'Goal deleted successfully', goal: deletedGoal });
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};

