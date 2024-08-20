
const Header = () => {
    return (
        <header
          style={{
                backgroundColor: '#0a0a94',
                padding: '20px 10px',
                display: 'flex',
                justifyContent: 'flex-start',
                width: '100%',
                alignItems: 'center',
        }}
        >
         <div style={{ textAlign: 'left', width: '100%'}}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingLeft: '50px',
                    paddingRight: '490px',
                }}>
                <h1 style={{
                    fontFamily: 'Times New Roman',
                    fontSize: '50px',
                    color: 'white',
                    margin: '0',
                }}
                >
                    Welcome to Coursework Calendar
                </h1>
                <p 
                  style={{
                        fontSize: '1.2rem',
                        marginTop: '10px',
                        fontStyle: 'italic',
                        color: 'white',
                }}>
                   &mdash;  22 July, 2024
                </p>
                </div>
                <div style={{
                    width: '90%',
                    height: '2px',
                    backgroundColor: 'white',
                    margin: '10px 0px 0px 50px',
                }}>
                </div>
            </div>
     </header>
    );
};

export default Header; 

