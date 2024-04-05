from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# Don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class FlaskTests(TestCase):

    # write tests for every view function / feature!

    def test_home(self):
        """ Testing initial data on homepage and html """
        
        with app.test_client() as client:
            resp = client.get('/')
            html = resp.get_data(as_text=True)          
            
            self.assertEqual(resp.status_code, 200)
            self.assertIn('board_contents', session)
            self.assertIsNone(session.get('game_count'))
            self.assertIsNone(session.get('highscore'))
            self.assertIn('Your score:', html)    
              
    def test_word_not_on_board(self):
        """ Testing for word not on board """
        
        with app.test_client() as client:
            start = client.get('/')            
            data = {'word': 'astonishing'}
            resp = client.post('/input', query_string = data)
            
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['result'], 'not-on-board')
            
    def test_invalid_word(self):
        """ Testing for word not in dictionary """
        
        with app.test_client() as client:
            start = client.get('/')
            data = {'word': 'asdfasdf'}
            resp = client.post('/input', query_string = data)
            
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['result'], 'not-word') 
    
    def test_word_on_board(self):
        """ Testing for word on board """
        
        with app.test_client() as client:
            start = client.get('/')
            board = []
            for i in range(5):
                row = ['A' for i in range(5)]
                board.append(row)
            with client.session_transaction() as sesh:
                sesh['board_contents'] = board
            data = {'word': 'A'}
            resp = client.post('/input', query_string = data)
            
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['result'], 'ok')               


