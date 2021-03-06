import React, { useState, createContext }from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {IList} from '../domain/entity';

import CreateListId from './CreateListId';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        urlInput: {
            '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
            },
        },
        stdButton: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        repNum: {
            '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '7ch',
            },
        },
        multilineColor:{
            color:'white'
        },
    }),
);

export const VideoListContext = createContext([] as IList[]);
export const RepeatNumContext = createContext(0);

const InputList: React.FC = () =>
{
    const classes = useStyles();
    const [inputUrl, setInpurUrl] = useState<string>("");
    const [videoList, setVideolist] = useState<IList[]>([]);
    const [repeatNum, setRepeatNum] = useState<number>(0);

    const handleInputUrl = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        // e.stopPropagation();
        e.preventDefault();
        setInpurUrl(e.target.value)
    }

    const addUrlToList = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let url: string = inputUrl;
        if(url == ""){
            alert("urlを入力してから[ADD URL TO LIST]を押してください")
            return;
        } 
        if(!url.match(/https/) && !url.match(/http/)){
           alert("無効なリンクです")
           return; 
        }
        if(videoList.length>0){
            for(let i= 0; i < videoList.length; i++)
            {
                let vl = videoList[i].name;
                if(url.includes(vl)){
                    alert("リンクが重複しています");
                    return;
                }
            }
        }

        setVideolist([...videoList, { id: videoList.length + 1, name: inputUrl }]);
        setInpurUrl("");
    };
    
    const handleRepeatNum = (event: React.ChangeEvent<HTMLInputElement>): void =>
    {
        const value: number = Number(event.target.value);
        setRepeatNum(value);
    }

    const cancelReturn = (e: React.FormEvent<HTMLFormElement>): void =>
    {
        e.preventDefault();
    }

    return(
        <div>
            <form className={classes.urlInput} noValidate autoComplete="off" onSubmit={cancelReturn}>
                <TextField 
                    id="outlined-basic"
                    label="URL"
                    variant="outlined" 
                    value={inputUrl}
                    onChange={handleInputUrl}
                    inputProps={{className: classes.multilineColor }}
                    InputLabelProps={{ className: classes.multilineColor }}
                />

                <Button variant="contained" color="secondary" onClick={addUrlToList} className={classes.stdButton}>
                    Add Url To List
                </Button>
            </form>



            {videoList.map((item: IList) => <p>{item.name}</p>)}

            <form className={classes.repNum} noValidate autoComplete="off" onSubmit={cancelReturn}>
                <TextField
                    id="filled-number"
                    label="RepeatNum"
                    type="number"
                    inputProps={{className: classes.multilineColor }}
                    InputLabelProps={{
                        className: classes.multilineColor
                    }}
                    variant="filled"
                    value={repeatNum}
                    onChange = {handleRepeatNum}
                />
            </form>
            {/* <VideoListContext.Provider value={videoList}> */}
            <RepeatNumContext.Provider value={repeatNum}>
            <VideoListContext.Provider value={videoList}>
                <CreateListId />
            </VideoListContext.Provider>
            </RepeatNumContext.Provider>
            
        </div>
    )
}

export default InputList;