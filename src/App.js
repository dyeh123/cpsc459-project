import './App.css';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Container, Typography, Paper, Card, CardContent, CardActions, Grid } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import { CardMembership } from '@mui/icons-material';
import { HighlightWithinTextarea } from 'react-highlight-within-textarea'

const useStyles = makeStyles({
  textField: {
      width: '90%',
      marginLeft: 'auto',
      marginRight: 'auto',            
      paddingBottom: 0,
      marginTop: 0,
      fontWeight: 500
  },
  input: {
      color: 'white'
  }
});

function App() {
  const classes = useStyles();
  const [currentLabel, setLabel] = useState("");
  const [text, setText] = useState("");
  const [labels, setLabels] = useState(["Someone is happy", "Someone is sad"]);
  let colors = ['green', 'aqua', 'pink', 'yellow', 'red', 'orange', 'gray'];
  const saveCurrentLabel = newLabel => {
    setLabel(newLabel.target.value);
  }

  const saveCurrentText = newText => {
    setText(newText.target.value);
  }

  async function getScores() {
    let data = {"text": text,
    "labels": labels};
    const response = await fetch("https://flask.thomaswoodside.com/classify", {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  return (
    <div className="App">
      <header className="App-header">
        <div class="flexbox-container">
          <Card style={{flex:1, margin:100}}>
            <CardContent>
              <TextField
                id="text-entry"
                placeholder="Enter text here"
                multiline
                fullWidth
                required
                rows={23}
                maxRows={Infinity}
                onChange={saveCurrentText}
              />
              {/* <HighlightWithinTextarea

                highlight={'abc'}
               
              /> */}
            </CardContent>
          
          </Card>
          {/* <Container style={{flex: 1, marginTop: 100}}>
            <TextField
              id="text-entry"
              placeholder="Enter text here"
              multiline
              fullWidth
              required
              rows={23}
              maxRows={Infinity}
              //style = {{width: 1000}}
            />
          </Container> */}
          <Card style={{flex:1, margin: 100, width: 1000}}>
            
            <CardActions>
              <Container>
                <TextField
                  placeholder="Enter label here"
                  value={currentLabel}
                  onChange={saveCurrentLabel}
                >
                </TextField>
              </Container>
              <Button variant="contained" onClick={() => setLabels(oldArray => [...oldArray, currentLabel])}>Add Label</Button>
            </CardActions>
            <CardContent>
              <Container style={{flexDirection: 'column', overflowY: 'scroll'}}>
                {
                labels.map((elem, index) => (
                  <Button 
                  startIcon={<CircleIcon style={{fill: colors[index]}}/>} 
                  endIcon={<CloseIcon/>} 
                  variant="contained" 
                  sx={{borderRadius: 30}}
                  onClick={() => setLabels(labels.filter(item => item !== elem))}
                  >
                  {elem}
                  </Button>
                ))
                }
              </Container>
              <Button
              variant="contained"
              onClick={() => getScores().then(data => {console.log(data)})}
              >
              Run
              </Button>
            </CardContent>
          </Card>
          
        </div>
      </header>
    </div>
  );
}

export default App;
