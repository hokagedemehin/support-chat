import FadeLoader from "react-spinners/FadeLoader";

const Loading = () => {
    return (
        <center style={{display: "grid", placeItems: "center", height: "100vh"}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <img 
                src="data:image/webp;base64,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" 
                alt="loading image"
                
                style={{ marginBottom: 10}}
                height={200} />
                <FadeLoader color="#3CBC28" size={50} />

            </div>

        </center>
    )
}

export default Loading
