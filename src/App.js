import './App.css';
import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Container, Typography, Card, CardContent, CardActions } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import { HighlightWithinTextarea } from 'react-highlight-within-textarea'

function App() {
  const [currentSearch, setSearch] = useState("");
  const [text, setText] = useState("");
  const [searches, setSearches] = useState([]);
  const [highlights, setHighlights] = useState([]);
  let highlightPointers = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  
  let colors = ['yellow', 'aqua', 'pink', 'green', 'red', 'orange', 'gray'];

  const YellowHighlight = (props) => {
    return <mark style={{ backgroundColor: colors[0] }} ref={highlightPointers[0]}>{props.children}</mark>;
  };

  const AquaHighlight = (props) => {
    return <mark style={{ backgroundColor: colors[1] }} ref={highlightPointers[1]}>{props.children}</mark>;
  };

  const PinkHighlight = (props) => {
    return <mark style={{ backgroundColor: colors[2] }} ref={highlightPointers[2]}>{props.children}</mark>;
  };

  const GreenHighlight = (props) => {
    return <mark style={{ backgroundColor: colors[3] }} ref={highlightPointers[3]}>{props.children}</mark>;
  };

  const RedHighlight = (props) => {
    return <mark style={{ backgroundColor: colors[4] }} ref={highlightPointers[4]}>{props.children}</mark>;
  };

  const OrangeHighlight = (props) => {
    return <mark style={{ backgroundColor: colors[5] }} ref={highlightPointers[5]}>{props.children}</mark>;
  };

  const GrayHighlight = (props) => {
    return <mark style={{ backgroundColor: colors[6] }} ref={highlightPointers[6]}>{props.children}</mark>;
  };

  const highlightComponents = [YellowHighlight, AquaHighlight, PinkHighlight, GreenHighlight, RedHighlight, OrangeHighlight, GrayHighlight];

  const saveCurrentSearch = newSearch => {
    setSearch(newSearch.target.value);
  }

  const saveCurrentText = newText => {
    if (newText !== text)
      setHighlights([]);
    setText(newText);
  }

  const processData = data => {
    for (let i = 0; i < searches.length; i++) {
      let start = data[searches[i]][0][2][0];
      let end = data[searches[i]][0][2][1];
      setHighlights(oldArray => [...oldArray, {component: highlightComponents[i], highlight: [start, end-1], className: colors[i]}]);
    }
  }

  const scrollToHighlight = (highlightRef) => {
    highlightRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function getScores() {
    let data = {"text": text,
    "labels": searches};
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
        <Card style={{marginRight: 300, marginLeft: 300, marginTop: 50}}>
          <CardContent>
            <Typography sx={{ fontSize: 16, fontFamily: 'Avanta Garde' }}>
              Welcome! This is an interactive interface that will let you search for "ideas" in text. Type in any queries or questions you have about a certain text and find the answers to them indicated by the corresponding colored highlights.
              You can click on the button for a given search to automatically locate the corresponding answer in the text. Note: This app supports up to 7 searches at a time.
            </Typography>
          </CardContent>
        </Card>
        <div className="flexbox-container">
          <Card style={{flex:1, marginLeft:100, marginBottom: 50, marginRight:50, marginTop: 50, width: 200, height: 600, overflowY: 'scroll'}}>
            <CardContent style={{}}>
              <HighlightWithinTextarea
                value={text}
                highlight={highlights}
                onChange= {saveCurrentText}
              />
            </CardContent>
          </Card>
          <div className='clear-buttons'>
            <Button
            variant="contained"
            onClick={() => {
              setText("");
              setHighlights([]);
            }}
            >
              Clear Text
            </Button>
            <Button
            variant="contained"
            onClick={() => {
              setSearches([]);
              setSearch("");
              setHighlights([]);
            }}
            >
              Clear Searches
            </Button>
          </div>
          <Card style={{flex:1, marginLeft:50, marginBottom: 50, marginRight:100, marginTop: 50, width: 1000}}>            
            <CardActions>
              <Container>
                <TextField
                  placeholder="Enter search here"
                  value={currentSearch}
                  onChange={saveCurrentSearch}
                >
                </TextField>
              </Container>
              <Button
                variant="contained"
                onClick={() => {
                  if (searches.length > 6) {
                    alert("You have reached the search limit. Please delete a search to allow another.");
                  } else if (searches.includes(currentSearch)) {
                    alert("You already have this query!");
                  } else if (currentSearch == "") {
                    alert("Please enter a query.");
                  } else {
                    setSearches(oldArray => [...oldArray, currentSearch]);
                  }
                  setSearch("");
                }}
              >
              Add Search
              </Button>
            </CardActions>
            <CardContent>
              <Container style={{flexDirection: 'column', overflowY: 'scroll'}}>
                {
                searches.map((elem, index) => (
                  <Button 
                  startIcon={<CircleIcon style={{fill: colors[index]}}/>} 
                  endIcon={
                    <CloseIcon
                      onClick={
                        () => {
                          console.log(highlights);
                          setSearches(searches.filter(item => item !== elem));
                          setHighlights([]);
                        }
                      }
                    />
                  }
                  onClick={() => {scrollToHighlight(highlightPointers[index])}} 
                  variant="contained" 
                  sx={{borderRadius: 30}}
                  key={elem}
                  >
                  {elem}
                  </Button>
                ))
                }
              </Container>
              <Button
              variant="contained"
              onClick={() => {
                setHighlights([]);
                getScores().then(data => {console.log(data); processData(data);})
              }}
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
