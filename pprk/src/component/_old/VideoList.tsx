import React, { useState }from 'react';
import { render } from "react-dom";
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Button from '@material-ui/core/Button';
import ReactPlayer from 'react-player'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ReactExport from "react-data-export";
import * as Scroll from 'react-scroll';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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
            width: '25ch',
            },
        },
        vectionButton: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        vectionSlider: {
            '& > *': {
                margin: theme.spacing(1),
                width: 300,
            },
        },
        sliderInput: {
            '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
            },
        },
    }),
);

function valuetext(value: number) {
    return `${value}°C`;
}

interface IItem {
    id: number;
    name: string;
}

interface ITiming {
    id: number;//1試行内のid
    cid: number; //試行番号
    lid: number; //条件番号
    timing: number;
}

interface IDuration {
    cid: number;//試行番号
    lid: number;//条件番号
    value: number;
}

interface ISlider {
    // cid: number; //試行番号
    // lid: number; //条件番号
    id: number;  //主観強度の種類
    label: string;
    // value: number;
}

const VideoList: React.FC = () =>
{
    const classes = useStyles();
    const [inputUrl, setInpurUrl] = React.useState<string>("");
    const [videoList, setVideolist] = React.useState<IItem[]>([]);
    const [repeatNum, setRepeatNum] = React.useState<number>(0);
    const [playBool, setPlayBool] = React.useState<boolean>(false);
    const [videoUrl, setVideoUrl] = React.useState<string>("");
    const [controlId, setControlId] = React.useState<number>(0);
    const [listId, setListId] = React.useState<number[]>([]);
    const [duration, setDuration] = React.useState<number>();
    // const [played, setPlayed] = React.useState<number>();
    const [playedSeconds, setPlayedSeconds] = React.useState<number>();
    const [vectionDownList, setVectionDown] = React.useState<ITiming[]>([]);
    const [vectionUpList, setVectionUp] = React.useState<ITiming[]>([]);
    const [vectionDurationList, setVectionDurationList] = React.useState<IDuration[]>([]);

    const [inputSlider, setInputSlider] = React.useState<string>("");
    const [vectionSliderList, setVectionSliderList] = React.useState<ISlider[]>([]);

    const addUrlToList = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setVideolist([...videoList, { id: videoList.length + 1, name: inputUrl }]);
        setInpurUrl("");
    };

    const addInputSliderToList = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setVectionSliderList([...vectionSliderList, { id: vectionSliderList.length + 1, label: inputSlider }]);
        setInputSlider("");
    }

    const handleRepeatNum = (event: React.ChangeEvent<HTMLInputElement>): void =>
    {
        const value: number = Number(event.target.value);
        setRepeatNum(value);
    }

    const createList = (e: React.FormEvent<HTMLButtonElement>) => 
    {
        e.preventDefault();

        let _listId: number[] = [];
        for(let i = 0; i < videoList.length; i++)
        {
            for(let j = 0; j < repeatNum; j++)
            {
                _listId.push(i+1);
            }
        }
        _listId = shuffleArray(_listId);
        console.log(_listId);//再生リストをidで指定してランダム順にしている
        console.log(videoList);
        setListId(_listId);
    }

    const initialSetUrlToRender = (e: React.FormEvent<HTMLButtonElement>) => 
    {
        e.preventDefault();
        let cid: number = controlId;
        let inputId: number = listId[cid];
        let value: any = videoList.find(({id}) => id === inputId)?.name;

        console.log("inputid:"+listId[cid]);
        
        console.log(cid);
        setVideoUrl(value);
    }

    //ref: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    const shuffleArray = (array: number[]) =>
    {
        const outArray = Array.from(array);
        for (let i = outArray.length - 1; i > 0; i--) 
        {
            const r = Math.floor(Math.random() * (i + 1));
            const tmp = outArray[i];
            outArray[i] = outArray[r];
            outArray[r] = tmp;
        }
        return outArray;
    }

    const handlePauseBool = (e: React.FormEvent<HTMLButtonElement>) => 
    {
        setPlayBool(false);
    }

    const handlePlayBool = (e: React.FormEvent<HTMLButtonElement>) => 
    {
        Scroll.scroller.scrollTo('player', {
            duration: 500,
            smooth: true
        })
        setPlayBool(true);
    }

    const setVideoUrlFromList = () =>
    {
        let cid: number = controlId+1;
        let inputId: number = listId[cid];
        let value: any = videoList.find(({id}) => id === inputId)?.name;
        
        console.log("inputid:"+listId[cid]);

        //リストが終了したらurlを空にする
        if(cid == listId.length)
        {
            value = "";
        }

        setPlayBool(false);
        setVideoUrl(value);
    }

    const handleIncreControlId = () => 
    {
        // e.preventDefault();

        let coid: number = controlId+1;
        setControlId(coid);
        console.log(coid);
        
        setVideoUrlFromList();
        alertInputInfomation();
    }

    const alertInputInfomation = () =>
    {
        alert("Please enter a subjective intensity");
    }

    const handleDuration = (duration: any) =>
    {
        setDuration(duration);
        console.log("duration:" + duration);//動画の長さを秒で返す
    }

    // const handlePlayed = (state: any) =>
    // {
    //     setPlayed(state.played);
    //     console.log(played);
    // }

    const handlePlayedSeconds = (state: any) =>
    {
        setPlayedSeconds(state.playedSeconds);
        // console.log("seconds:"+playedSeconds);
    } 

    const handleVectionButtonDown_key =  (e: React.KeyboardEvent) =>
    {
        // e.preventDefault();
        e.stopPropagation();
        const KEY_CODE = 13;
        let downValue: number = Number(playedSeconds);
        if(e.keyCode == KEY_CODE)
        {
            let did = vectionDownList.length + 1
            setVectionDown([...vectionDownList, {lid: listId[controlId] ,cid: controlId, id: did, timing: downValue }]);
            // console.log("keydown"+downValue);
        }
    }

    const handleVectionButtonUp_key =  (e: React.KeyboardEvent) =>
    {
        // e.preventDefault();
        e.stopPropagation();
        const KEY_CODE = 13;
        let upValue: number = Number(playedSeconds);
        if(e.keyCode == KEY_CODE)
        {
            let uid = vectionUpList.length + 1;
            setVectionUp([...vectionUpList, {lid: listId[controlId], cid: controlId, id: uid, timing: upValue }]);
            let downList: ITiming[] = vectionDownList.filter((v) => v.id <= uid);//keydownの連続分を削除したリストを作成
            setVectionDown(downList);
            // console.log("keyup"+upValue);
        }
    }

    const handleInputUrl = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        // e.stopPropagation();
        e.preventDefault();
        setInpurUrl(e.target.value)
    }

    const handleInputSlider = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        // e.stopPropagation();
        e.preventDefault();
        setInputSlider(e.target.value);
    }

    const calcVectionDuration = () =>
    {
        // e.preventDefault();
        let sumkeyDownTime: number = 0;
        let coid: number = controlId-1;
        console.log("coid:"+coid);

        console.dir("downlist"+vectionDownList.length);
        console.dir("uplist"+vectionUpList.length);

        let cidKeyDownList: ITiming[] = vectionDownList.filter((v) => v.cid >= coid);
        let cidKeyUpList: ITiming[] = vectionUpList.filter((v) => v.cid >= coid);//coid番目の試行のkeydownuplistだけ抽出

        let preUpLength: number = 0;
        if(coid > 0)
        {
            preUpLength = vectionUpList.filter((v) => v.cid < coid).length;//coid番目試行以前の配列の長さを取得
        }
        
        console.log("ciddownlist"+cidKeyDownList);
        console.log("ciduplist"+cidKeyUpList);

        for(let i=0; i < cidKeyUpList.length; i++)
        {
            let vd: any = cidKeyDownList.find(({id}) => id == i+1+preUpLength)?.timing;//cidが2以降のやつのidは1からじゃない.上でfilterしてもそのidはかわらない
            let vu: any = cidKeyUpList.find(({id}) => id == i+1+preUpLength)?.timing;
            // let vd: any = vectionDownList.find(({id}) => id === i+1)?.timing;
            // let vu: any = vectionUpList.find(({id}) => id === i+1)?.timing;
            console.log("vd:"+vd);
            console.log("vu:"+vu);

            let span: number = vu-vd;
            // let span: number = 1;
            sumkeyDownTime += span;
            // console.log("span:"+span);
        }
        console.log("sumkeydowntime:"+sumkeyDownTime);//押した時間の合計
        setVectionDurationList([...vectionDurationList, { lid: listId[coid], cid: coid, value: sumkeyDownTime}]);
        //controlId-1はさきにincrementIDがはしっちゃっててその調整あとでちゃんとシュッとするように
    }

    const handleContinue = (e: React.FormEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();
        calcVectionDuration();

        // Scroll.scroller.scrollTo('player', {
        //     duration: 500,
        //     smooth: true
        // })
        // setPlayBool(true);
        //ここでsetboolを回避することでcalcvectionduration();のkeydown時の謎発火を防げた
    }

    const handleTest = (e: React.FormEvent<HTMLButtonElement>) =>
    {
        console.log("durationList: "+vectionDurationList);
    }

    return (
        <div onKeyDown={handleVectionButtonDown_key} onKeyUp={handleVectionButtonUp_key}>
            <form className={classes.urlInput} noValidate autoComplete="off">
                <TextField 
                    id="outlined-basic"
                    label="URL"
                    variant="outlined" 
                    value={inputUrl}
                    onChange={handleInputUrl}
                />
            </form>

            <div className={classes.stdButton}>
                <Button variant="contained" color="secondary" onClick={addUrlToList}>
                    Add Url To List
                </Button>
            </div>

            {videoList.map((item: IItem) => <p>{item.name}</p>)}

            <form className={classes.repNum} noValidate autoComplete="off">
                <TextField
                id="filled-number"
                label="RepeatNum"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="filled"
                value={repeatNum}
                onChange = {handleRepeatNum}
                />
            </form>

            <div className={classes.stdButton}>
                <Button variant="contained" onClick={createList}>
                    CreateList
                </Button>
            </div>

            <form className={classes.sliderInput} noValidate autoComplete="off">
                <TextField 
                    id="outlined-basic"
                    label="subjective intensity"
                    variant="outlined" 
                    value={inputSlider}
                    onChange={handleInputSlider}
                />
            </form>

            <div className={classes.stdButton}>
                <Button variant="contained" color="secondary" onClick={addInputSliderToList}>
                    Add Subjective Intensity To List
                </Button>
            </div>
            
            {vectionSliderList.map((label: ISlider) => 
                <p>{label.label}</p>
            )}

            <div className={classes.stdButton}>
                <Button variant="contained" color="primary" onClick={initialSetUrlToRender}>
                    LaunchPlayer
                </Button>
            </div>

            <div className='player-wrapper'>
                <ReactPlayer 
                    className='react-player'
                    name="player"
                    url={videoUrl} 
                    // url='https://youtu.be/3Dr91z1-Iug'
                    playing={playBool} 
                    onEnded={handleIncreControlId} 
                    onDuration={handleDuration}
                    onProgress={handlePlayedSeconds}
                    width='100%'
                    height='100%'
                />
            </div>

            {/* <div className={classes.stdButton}>
                <Button variant="contained" color="secondary" onClick={handlePauseBool}>
                    pause
                </Button>
            </div> */}

            {/* <div className={classes.vectionButton}>
                <Button 
                    variant="contained"
                    onMouseDown={handleVectionButtonDown}
                    onMouseUp={handleVectionButtonUp}
                    // onKeyDown={handleVectionButtonDown_key}
                    // onKeyUp={handleVectionButtonUp_key}
                    >VectionButton
                </Button>
            </div> */}
            {/* <div>
                <input
                    type="text"
                    onKeyDown={handleVectionButtonDown_key}
                    onKeyUp={handleVectionButtonUp_key}
                />

            </div> */}
            {/* <div>
                <Button variant="contained" color="secondary" onClick={handleTest}>test</Button>
            </div> */}

            <div className={classes.stdButton}>
                <Button variant="contained" color="primary" onClick={handlePlayBool}>
                    play
                </Button>
            </div>

            {vectionSliderList.map((label: ISlider) => 
                <div className={classes.vectionSlider}>
                    <Typography id="vectionSlider" gutterBottom>
                        {label.label}
                    </Typography>
                    <Slider
                    defaultValue={50}
                    getAriaValueText={valuetext}
                    aria-labelledby="vectionSlider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={100}
                    // value={label.id}
                    />
                </div>
            )}

            <div className={classes.stdButton}>
                <Button variant="contained" color="primary" onClick={handleContinue}>
                    input
                </Button>
            </div>

            {/* <button onClick={handleIncreControlId}>next</button> */}
            {/* <button onClick={handleDecreControlId}>back</button> */}
            <div>
                <ExcelFile>
                    <ExcelSheet data={vectionDownList} name="VectionDownList">
                        <ExcelColumn label="試行番号" value="cid"/>
                        <ExcelColumn label="条件番号" value="lid"/>
                        {/* <ExcelColumn label="id" value="id"/> */}
                        <ExcelColumn label="潜時(down)(sec)" value="timing"/>
                    </ExcelSheet>
                    <ExcelSheet data={vectionUpList} name="VectionUpList">
                        <ExcelColumn label="試行番号" value="cid"/>
                        <ExcelColumn label="条件番号" value="lid"/>
                        {/* <ExcelColumn label="id" value="id"/> */}
                        <ExcelColumn label="潜時(up)(sec)" value="timing"/>
                    </ExcelSheet>
                    <ExcelSheet data={vectionDurationList} name="VectionDurationList">
                        <ExcelColumn label="試行番号" value="cid"/>
                        <ExcelColumn label="条件番号" value="lid"/>
                        <ExcelColumn label="持続時間" value="value"/>
                    </ExcelSheet>
                    {/* <ExcelSheet data={dataSet2} name="Leaves">
                        <ExcelColumn label="Name" value="name"/>
                        <ExcelColumn label="Total Leaves" value="total"/>
                        <ExcelColumn label="Remaining Leaves" value="remaining"/>
                    </ExcelSheet> */}
                </ExcelFile>
            </div>
        </div>
    );
};

export default VideoList;