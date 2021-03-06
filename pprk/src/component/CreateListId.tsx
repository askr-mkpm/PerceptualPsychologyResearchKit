import React, { useState, useContext, createContext }from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {IList} from '../domain/entity';

import Player from './Player';
import {VideoListContext, RepeatNumContext} from './InputList';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        stdButton: {
            marginBottom: theme.spacing(5),
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }),
);

//ref: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const shuffleArray: any = (array: number[]) =>
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

export const ListIdContext = createContext([] as number[]);

const CreateListId: React.FC = () =>
{
    const classes = useStyles();
    const videoList: IList[] = useContext(VideoListContext);
    const repeatNum: number = useContext(RepeatNumContext);

    const [listId, setListId] = useState<number[]>([]);

    const createList = (e: React.FormEvent<HTMLButtonElement>) => 
    {
        e.preventDefault();

        if(repeatNum <= 0){
            alert("RepaetNumを0より大きな値にしてください");
            return;
        }
        if(videoList.length == 0)
        {
            alert("urlが入力されていません");
            return;
        }

        let _listId: number[] = [];
        for(let i = 0; i < videoList.length; i++)
        {
            for(let j = 0; j < repeatNum; j++)
            {
                _listId.push(i+1);
            }
        }
        _listId = shuffleArray(_listId);

        console.log(_listId);
        console.log(videoList);

        setListId(_listId);

        alert(
            "繰り返し回数:" 
            + repeatNum 
            + " "
            + "の動画リストを作成しました。[LAUNCHPLAYER]を押して動画プレイヤーを起動してください。"
        );
    }

    return (
        <div>
            <div className={classes.stdButton}>
                <Button variant="contained" onClick={createList}>
                    CreateList
                </Button>
            </div>

            <ListIdContext.Provider value={listId}>
                <Player />
            </ListIdContext.Provider>
        </div>
    )
}

export default CreateListId;