// 用户数据操作函数
const UserManager = {
    // 添加新用户
    addUser: function(userData) {
        const users = this.getUsers();
        users[userData.username] = userData;
        this.saveUsers(users);
        return userData;
    },
    
    // 获取所有用户
    getUsers: function() {
        return JSON.parse(localStorage.getItem('chatUsers')) || {};
    },
    
    // 保存用户数据
    saveUsers: function(users) {
        localStorage.setItem('chatUsers', JSON.stringify(users));
    },
    
    // 根据ID搜索用户
    findUserById: function(userId) {
        const users = this.getUsers();
        return Object.values(users).find(user => user.id === userId);
    },
    
    // 验证用户登录
    validateLogin: function(username, password) {
        const users = this.getUsers();
        const user = users[username];
        return user && user.password === password ? user : null;
    },
    
    // 生成用户ID
    generateUserId: function() {
        let id;
        const users = this.getUsers();
        do {
            id = Math.floor(100000 + Math.random() * 900000).toString();
        } while (Object.values(users).some(user => user.id === id));
        return id;
    }
};

// 好友关系操作函数
const FriendManager = {
    // 添加好友
    addFriend: function(username, friendData) {
        const friends = this.getFriends();
        if (!friends[username]) {
            friends[username] = [];
        }
        
        // 检查是否已经是好友
        const existingFriend = friends[username].find(f => f.username === friendData.username);
        if (!existingFriend) {
            friends[username].push({
                ...friendData,
                addTime: new Date().toISOString()
            });
            this.saveFriends(friends);
        }
    },
    
    // 获取好友列表
    getFriends: function(username = null) {
        const friends = JSON.parse(localStorage.getItem('chatFriends')) || {};
        return username ? (friends[username] || []) : friends;
    },
    
    // 保存好友数据
    saveFriends: function(friends) {
        localStorage.setItem('chatFriends', JSON.stringify(friends));
    }
};

// 消息管理函数
const MessageManager = {
    // 发送消息
    sendMessage: function(fromUser, toUser, content) {
        const messages = this.getMessages();
        
        // 初始化消息记录
        if (!messages[fromUser]) messages[fromUser] = {};
        if (!messages[fromUser][toUser]) messages[fromUser][toUser] = [];
        if (!messages[toUser]) messages[toUser] = {};
        if (!messages[toUser][fromUser]) messages[toUser][fromUser] = [];
        
        const message = {
            sender: fromUser,
            content: content,
            timestamp: new Date().toISOString(),
            type: 'text'
        };
        
        // 添加到双方的聊天记录
        messages[fromUser][toUser].push(message);
        messages[toUser][fromUser].push(message);
        
        this.saveMessages(messages);
        return message;
    },
    
    // 获取聊天记录
    getMessages: function(user1 = null, user2 = null) {
        const messages = JSON.parse(localStorage.getItem('chatMessages')) || {};
        if (user1 && user2) {
            return (messages[user1] && messages[user1][user2]) || [];
        }
        return messages;
    },
    
    // 保存消息数据
    saveMessages: function(messages) {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
};

// 好友申请管理函数
const FriendRequestManager = {
    // 发送好友申请
    sendRequest: function(fromUser, toUser, message = '') {
        const requests = this.getRequests();
        if (!requests[toUser]) {
            requests[toUser] = [];
        }
        
        const request = {
            from: fromUser.from,
            fromId: fromUser.fromId,
            fromNickname: fromUser.fromNickname,
            fromAvatar: fromUser.fromAvatar,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        requests[toUser].push(request);
        this.saveRequests(requests);
        return request;
    },
    
    // 获取好友申请
    getRequests: function(username = null) {
        const requests = JSON.parse(localStorage.getItem('friendRequests')) || {};
        return username ? (requests[username] || []) : requests;
    },
    
    // 保存申请数据
    saveRequests: function(requests) {
        localStorage.setItem('friendRequests', JSON.stringify(requests));
    }
};
