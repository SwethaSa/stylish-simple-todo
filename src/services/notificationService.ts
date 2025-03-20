
// Request notification permission on page load
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
};

export const scheduleNotification = (task: { id: string; title: string }, dueDate: Date) => {
  // Calculate the time until the task is due
  const now = new Date();
  const timeUntilDue = dueDate.getTime() - now.getTime();
  
  // Only schedule if it's in the future
  if (timeUntilDue > 0) {
    setTimeout(() => {
      sendNotification(task);
    }, timeUntilDue);
    
    console.log(`Notification scheduled for ${task.title} at ${dueDate.toLocaleString()}`);
    return true;
  }
  
  return false;
};

export const sendNotification = (task: { id: string; title: string }) => {
  if (Notification.permission === "granted") {
    const notification = new Notification("Task Reminder", {
      body: `It's time to complete: ${task.title}`,
      icon: "/favicon.ico",
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    // Also play a sound
    const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3");
    audio.play().catch(e => console.log("Could not play notification sound", e));
    
    return true;
  }
  
  return false;
};
