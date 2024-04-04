from flask import Flask, request, render_template, jsonify, redirect, flash
from flask import session, make_response
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)
boggle_game = Boggle()
board_contents = boggle_game.make_board()
history = []

@app.route('/')
def start_game():
    session['board_contents'] = board_contents
    return render_template('game.html', content=board_contents)

@app.route('/input', methods=['POST'])
def check_word():
    print('********************** made it here', request.args)
    word = request.args['word']
    history.append(word)
    is_valid = boggle_game.check_valid_word(board_contents, word)
    print('*************************', is_valid)
    # NEXT - return with jsonify? video 19.3.9
    print('**********************', history)
    return jsonify({'result': is_valid})

@app.route('/finished', methods=['POST'])
def store_data():
    print('*storing data*******************************', request.json)
    score = request.json['score']
    highscore = max(session.get("highscore", 0), score)
    session['highscore'] = highscore
    game_count = session.get('game_count', 0)
    session['game_count'] = game_count + 1
    print('*session data*******************************', session) 
    return jsonify(highestscore = highscore)
