import './App.css';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Container, Typography, Paper, Card, CardContent, CardActions, Grid } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import { CardMembership } from '@mui/icons-material';

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
  const [labels, setLabels] = useState(["Someone is happy", "Someone is sad"]);
  let colors = ['green', 'aqua', 'pink', 'yellow', 'red', 'orange', 'gray'];
  const saveCurrentLabel = newLabel => {
    setLabel(newLabel.target.value);
  }

  async function getScores() {
    let data = {"text": "Great taffy at a great price.  There was a wide assortment of yummy taffy.  Delivery was very quick.  If your a taffy lover, this is a deal.",
    "labels": [
      "Somebody is content.",
      "Somebody is displeased.",
      "Taffy is mentioned.",
      "Someone got a good deal",
      "Good food is mentioned",
      "Someone is mad",
      "Someone hates something",
      "Someone talks about popcorn."
    ]};
    const response = await fetch("https://flask.thomaswoodside.com/classify", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log(response.json());
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
              />
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
