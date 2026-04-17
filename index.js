const fs = require('fs');
const tasksFile = './tasks.json';

// Helper: Read tasks
function readTasks(callback) {
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return callback(null, []);
            }
            return callback(err, null);
        }
        
        if (!data || data.trim() === '') {
            return callback(null, []);
        }
        
        try {
            const tasks = JSON.parse(data);
            callback(null, tasks);
        } catch (parseErr) {
            callback(parseErr, null);
        }
    });
}

// Helper: Write tasks
function writeTasks(tasks, callback) {
    const data = JSON.stringify(tasks, null, 2);
    fs.writeFile(tasksFile, data, 'utf8', callback);
}

// 1. Create a new task
function createTask(taskText, callback) {
    readTasks((err, tasks) => {
        if (err) return callback(err);
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        
        writeTasks(tasks, (err) => {
            if (err) return callback(err);
            callback(null, newTask);
        });
    });
}

// 2. View all tasks
function viewAllTasks(callback) {
    readTasks((err, tasks) => {
        if (err) return callback(err);
        callback(null, tasks);
    });
}

// 3. Edit a task
function editTask(taskId, newText, callback) {
    readTasks((err, tasks) => {
        if (err) return callback(err);
        
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            return callback(new Error('Task not found'), null);
        }
        
        tasks[taskIndex].text = newText;
        tasks[taskIndex].updatedAt = new Date().toISOString();
        
        writeTasks(tasks, (err) => {
            if (err) return callback(err);
            callback(null, tasks[taskIndex]);
        });
    });
}

// 4. Delete a task
function deleteTask(taskId, callback) {
    readTasks((err, tasks) => {
        if (err) return callback(err);
        
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            return callback(new Error('Task not found'), null);
        }
        
        const deletedTask = tasks[taskIndex];
        tasks.splice(taskIndex, 1);
        
        writeTasks(tasks, (err) => {
            if (err) return callback(err);
            callback(null, deletedTask);
        });
    });
}

// ============ Interactive Usage Example ============
console.log('Task Manager Ready\n');

// Example: Add a task, view all, edit, delete
createTask('Learn Node.js', (err, task) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('✓ Task created:', task.text);
        
        viewAllTasks((err, tasks) => {
            if (err) {
                console.error('Error:', err);
            } else {
                console.log(`\n📋 Total tasks: ${tasks.length}`);
                tasks.forEach(t => {
                    console.log(`  ${t.id} - ${t.text}`);
                });
            }
        });
    }
});