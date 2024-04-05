from flask import Flask, request, render_template, jsonify
from flask import session
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)
boggle_game = Boggle()
history = []

@app.route('/')
def start_game():
    """ start game and display board """
    
    board_contents = boggle_game.make_board()
    session['board_contents'] = board_contents
    return render_template('game.html', content=board_contents)

@app.route('/input', methods=['POST'])
def check_word():
    """ receive new word input and check if it's valid """
    
    word = request.args['word']
    if word in history:
        is_valid = 'duplicate'
    else:
        history.append(word)
        is_valid = boggle_game.check_valid_word(session['board_contents'], word)
    return jsonify({'result': is_valid})

@app.route('/finished', methods=['POST'])
def store_data():
    """ store history of highscore and number of games played """
    
    score = request.json['score']
    highscore = max(session.get("highscore", 0), score)
    session['highscore'] = highscore
    session['game_count'] = session.get('game_count', 0) + 1
    return jsonify(highestscore = highscore)
