import {useEffect, useState} from "react";
import {io} from "socket.io-client";

function App() {
    const [places, setPlaces] = useState();

    const [content, setContent] = useState([]);
    const [selection, setSelection] = useState([]);
    const placesCount = 50;
    const [connectedUser, setConnectedUser] = useState(0)

    useEffect(() => {
        const socket = io("http://localhost:3001", {});

        socket.on('users', (nbr) => {
            setConnectedUser(nbr)
        })

        return () => {
            socket.disconnect();
            console.log('socket disconnected');
        }
    }, [])

    useEffect(() => {

        const a = [];
        let step = 10;
        for (let i = 0; i < placesCount; i++) {
            const y = Math.floor(i / (step)) * 42;
            const x = i % step * 42;
            a.push(<button key={i}
                        style={{left: x, top: y}}
                        onClick={() => selectPlace(i)}
                        className={"absolute rounded-sm overflow-hidden flex items-center justify-center border border-gray-300 w-10 h-10"+(selection.includes(i)?' bg-yellow-300':' hover:bg-yellow-100 ') + (content.includes(i)?' bg-gray-300 text-gray-500 pointer-events-none':'')}>{i}</button>);
        }
        setPlaces(a);

    }, [selection,content])

    useEffect(()=>{

        fetch('http://localhost:3001/places')
            .then(raw => raw.json())
            .then(json => {
                const notAvailable = [];
                json.forEach(item => {
                    console.log(item.selection)
                    notAvailable.push(...item.selection)
                })
                setContent(notAvailable)
                console.log(content)
            });
        }, []
    )


    function selectPlace(i) {
        if(!selection.includes(i)){
            const copy = [...selection];

            if(selection.length >= 3){
                copy.shift();
                setSelection(copy);
            }
            copy.push(i);
            setSelection(copy);

            console.log('select', copy)
        } else if (selection.includes(i)){
            const copy = [...selection];
            copy.splice(selection.indexOf(i), 1);
            setSelection(copy);

        }
    }

    function buyPlaces(){

        console.log('buy', selection)
        fetch('http://localhost:3001/buy', {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body:  JSON.stringify({
                selection: selection
            })
        })
            .then(raw => raw.json())
            .then(json => {
                setContent([...content,...json.selection])
                setSelection([])
        });



    }

    return (
        <div className="h-screen flex items-center justify-center w-full">
            <img className={"w-40 mr-6"}
                 src={"/1200px-Chambéry_Savoie_Mont-Blanc_handball_logo.svg.png"}/>
            <div className={"flex items-center flex-col"}>
                <p className={"p-5 font-bold"}>Connected users : <span className={"text-yellow-600"}>{connectedUser}</span></p>

                <div className={"flex justify-end flex-col"}>
                    <div className={"w-[420px] h-[210px] relative"}>{places}</div>
                    <button className={"bg-black border-0 mt-1 text-white py-2 hover:bg-yellow-300 hover:text-black"} onClick={()=>buyPlaces()}>Acheter</button>
                </div>
            </div>

        </div>
    );
}

export default App;
