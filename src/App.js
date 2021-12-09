import './App.css';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Container, Typography, Paper, Card, CardContent, CardActions, Grid } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import { HighlightWithinTextarea } from 'react-highlight-within-textarea'

function App() {
  const [currentLabel, setLabel] = useState("");
  const [text, setText] = useState("");
  const [labels, setLabels] = useState(["Someone is happy", "Someone is sad"]);
  const [highlights, setHighlights] = useState([]);
  let colors = ['yellow', 'aqua', 'pink', 'green', 'red', 'orange', 'gray'];

  const saveCurrentLabel = newLabel => {
    setLabel(newLabel.target.value);
  }

  const saveCurrentText = newText => {
    setText(newText);
  }

  const processData = data => {
    for (let i = 0; i < labels.length; i++) {
      let start = data[labels[i]][0][2][0];
      let end = data[labels[i]][0][2][1];
      setHighlights(oldArray => [...oldArray, {highlight: [start, end-1], className: colors[i]}]);
    }
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
          <Card style={{flex:1, margin:100, width: 200, height: 600, overflowY: 'scroll'}}>
            <CardContent style={{}}>
              <HighlightWithinTextarea
                value={text}
                highlight={highlights}
                onChange= {saveCurrentText}
              />
            </CardContent>
          </Card>

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
              onClick={() => getScores().then(data => {console.log(data); processData(data);})}
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
