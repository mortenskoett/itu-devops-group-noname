/*
API Used with external MiniTweet Simulator 
*/

// Latest recieved 'latest' value
var LATEST = 0;

// TODO Autorization TODO
function not_req_from_simulator(request) {
    let from_simulator = request.getHeader("Authorization");
    let error = null;
    if (from_simulator !=  "Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh") {
        error = {"status": 403, "error_msg": "You are not authorized to use this resource!"};
    }
    return error;
}

// def not_req_from_simulator(request):
//     from_simulator = request.headers.get("Authorization")
//     if from_simulator != "Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh":
//         error = "You are not authorized to use this resource!"
//         return jsonify({"status": 403, "error_msg": error}), 403

// TODO Get user id, based on username
// def get_user_id(username):
//     user_id = query_db(
//         "SELECT user.user_id FROM user WHERE username = ?", [username], one=True
//     )
//     if user_id:
//         return user_id["user_id"]
//     else:
//         return None

function update_latest(req) {
    let { latest } = req.body;
    if (latest != -1) LATEST = latest;
}

// Get latest value (stored for each api request)
app.get('/latest', async function (req, res) {
    
    // Some response as json
    res.send({"latest": LATEST});
    res.end();

});


// User creation
app.post('/register', async function (req, res) {

    const body = JSON.parse(JSON.stringify(req.body));
    const { username, email, password } = body;
    
    // Try creating a new user
    // TODO
    error = None; // TODO Some error message from system


    if (len(error) > 0) {
        res.status(400).json({"status": 400, "error_msg": error})
    } else {
        res.status(204).send("");
    }
    
    res.end();
});

app.get('/msgs', async function (req, res){
    // TODO check sim credentials
    const body = JSON.parse(JSON.stringify(req.body));
    const { no_msgs=100 } = body;
    
    messages = None // TODO Get N message from System
    
    filtered_msgs = [];
    for (msg in messages) {
        filtered_msg = {};
        filtered_msg["content"] = msg["text"];
        filtered_msg["pub_date"] = msg["pub_date"];
        filtered_msg["user"] = msg["username"];
        filtered_msgs.append(filtered_msg);
    }
    res.status(204).json(JSON.stringify(filtered_msgs));
    res.end();
});

// Read user messages
app.get('/msgs/:username', async function (req, res) {
    // TODO check sim credentials

    let username = req.params.username;

    // TODO if user_id do not exists return status(404)
    const body = JSON.parse(JSON.stringify(req.body));
    const { no_msgs=100 } = body;

    filtered_msgs = [];
    for (msg in messages) {
        filtered_msg = {};
        filtered_msg["content"] = msg["text"];
        filtered_msg["pub_date"] = msg["pub_date"];
        filtered_msg["user"] = msg["username"];
        filtered_msgs.append(filtered_msg);
    }

    res.status(204).json(JSON.stringify(filtered_msgs));
    res.end();
});

// Post a user message
app.post('/msgs/:username', async function (req, res) {
    // TODO check sim credentials

    let username = req.params.username;
    
    // TODO post message
    
    res.status(204).send("");
    res.end();
});

// Follow/Unfollow a user
app.post('fllws/:username', async function (req, res) {
    // TODO check sim credentials
    const body = JSON.parse(JSON.stringify(req.body));
    

    // User id not found
    if (user_id == None) {
        res.status(404).send("");
        res.end();
    }
    if (body.contains("follow")) {
        const { follows_username } = body;
        // TODO get user ID and follow follows_user_id
        // Follow user
        /*
        if user dont exist respond with 404
            res.status(404).send("");
        if follows_user_id dont exists
            res.status(500).send("");
        */

        res.status(204).send("");
        res.end();

    } else if (body.contains("unfollow")) {
        // Unfollow user
        res.status(204).send("");
        res.end();
    } 
    else {}

});

// For a user, get who the user follows
app.get('fllws/:username', async function (req, res) {
    // TODO check sim credentials
    let username = req.params.username;

    follower_names = None // TODO a list of names

    res.status(204).send({"follows": follower_names});
    res.end();
});