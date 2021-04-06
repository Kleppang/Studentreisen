// React-spesifikt
import { Component } from "react";
import { Redirect } from "react-router-dom";

// 3rd-party Packages
import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import axios from 'axios';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import FormData from 'form-data';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

// Studentreisen-assets og komponenter
import CookieService from '../../../global/Services/CookieService';
import Loader from '../../../global/Components/Loader';
import '../CSS/Seminar.css';

class SeminarNew extends Component {
    constructor(props) {
        super(props)

        // Nytt seminar-spesifikke states, delt opp i før-visning autentisering og felt
        let datetimeNow = moment().format('YYYY-MM-DDTHH:mm:ss');
        let dateNow = moment().format('YYYY-MM-DD');
        this.state = {  loading : this.props.loading, authenticated : this.props.auth, 
                        SeminarNew_input_title : "", SeminarNew_input_startdate : datetimeNow, SeminarNew_input_enddate : dateNow, SeminarNew_input_address : "", 
                        SeminarNew_input_desc : "", SeminarNew_input_image : "", SeminarNew_input_imageprev : "",
                        submitDisabled : false, submitText : "Opprett seminar", submitOpacity: "1" }
    }

    onInputChange = e => {
        console.log(e);
        if(e.target.id === "SeminarNew_input_title") {
            this.setState({
                SeminarNew_input_title : e.target.value
            })
        } else if(e.target.id === "SeminarNew_input_startdate") {
            this.setState({
                SeminarNew_input_startdate : e.target.value
            })
        } else if(e.target.id === "SeminarNew_input_enddate") {
            this.setState({
                SeminarNew_input_enddate : e.target.value
            })
        } else if(e.target.id === "SeminarNew_input_address") {
            this.setState({
                SeminarNew_input_address : e.target.value
            })
        } else if(e.target.id === "SeminarNew_input_desc") {
            this.setState({
                SeminarNew_input_desc : e.target.value
            })
        }
    }

    onImageChange = e => {
        if(e.target.files && e.target.files[0]) {
            this.setState({
                SeminarNew_input_image: e.target.value,
                SeminarNew_input_imageprev: e.target.files[0]
            });
        } else {
            this.setState({
                SeminarNew_input_image: "",
                SeminarNew_input_imageprev: ""
            });
        }
    }
  
    // Utføres når bruker trykker på "Opprett seminar" eller trykker på Enter i ett av input-feltene
    handleSubmit = e => {
        // Stopper siden fra å laste inn på nytt
        e.preventDefault();
        
        // Slår midlertidig av "Opprett seminar"-knappen og endrer teksten til "Vennligst vent"
        this.setState({
            submitDisabled: true,
            submitText: "Vennligst vent",
            submitOpacity: "0.6"
        });

        const data = new FormData();

        data.append('title', this.state.SeminarNew_input_title);
        data.append('startdate', this.state.SeminarNew_input_startdate);
        data.append('enddate', this.state.SeminarNew_input_enddate);
        data.append('address', this.state.SeminarNew_input_address);
        data.append('description', this.state.SeminarNew_input_desc);
        data.append('token', CookieService.get("authtoken"));
        data.append('image', this.state.SeminarNew_input_imageprev);

        // Axios POST request
        axios
            // Henter API URL fra .env og utfører en POST request med dataen fra objektet over
            // Axios serialiserer objektet til JSON selv
            .post(process.env.REACT_APP_APIURL + "/seminar/submitSeminar", data)
            // Utføres ved mottatt resultat
            .then(res => {
                if(res.data.success === "temp") {
                    // Mottok OK fra server
                    this.setState({
                        authenticated: true
                    });

                    //window.location.href="/seminar";
                } else {
                    // Feil oppstod ved oppretting
                    this.setState({
                        submitDisabled: false,
                        submitText: "Opprett seminar",
                        submitOpacity: "1"
                    });
                }
            })
            .catch(err => {
                // En feil oppstod ved oppkobling til server
                this.setState({
                    submitDisabled: false,
                    submitText: "Opprett seminar",
                    submitOpacity: "1"
                });
            })
            // Utføres alltid uavhengig av andre resultater
            .finally(() => {
                // Gjør Opprett seminar knappen tilgjengelig igjen om seminaret ikke er opprettet over
                if(!this.state.authenticated) {
                    this.setState({
                        submitDisabled: false,
                        submitText: "Opprett seminar",
                        submitOpacity: "1"
                    });
                }
            });
    };

    render() {
        // Om vi er i loading fasen (Før mottatt data fra API) vises det et Loading ikon
        if(this.props.loading) {
            return(
                <section id="loading">
                    <Loader />
                </section>
            );
        }
        
        if(!this.props.loading && this.props.auth) {
            // Når loading fasen er komplett og bruker er innlogget, vis innholdet på nytt seminar-siden
            return (
                <>
                <main id="SeminarNew_main">
                    <Button id="SeminarNew_button_back" onClick={() => window.history.back()}>{"< Tilbake"}</Button>
                    <h1>Nytt seminar</h1>
                    <form id="SeminarNew_form" onSubmit={this.handleSubmit}>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Tittel</InputLabel>
                            <Input id="SeminarNew_input_title" required={true} value={this.state.SeminarNew_input_title} onKeyUp={this.onSubmit} onChange={this.onInputChange} autoFocus={true} />
                        </FormControl>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Startdato</InputLabel>
                            <Input id="SeminarNew_input_startdate" type="datetime-local" required={true} value={this.state.SeminarNew_input_startdate} onKeyUp={this.onSubmit} onChange={this.onInputChange} />
                        </FormControl>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Sluttdato</InputLabel>
                            <Input id="SeminarNew_input_enddate" type="date" required={true} value={this.state.SeminarNew_input_enddate} onKeyUp={this.onSubmit} onChange={this.onInputChange} />
                        </FormControl>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Adresse</InputLabel>
                            <Input id="SeminarNew_input_address" required={true} value={this.state.SeminarNew_input_address} onKeyUp={this.onSubmit} onChange={this.onInputChange} autoComplete="street-address" />
                        </FormControl>
                        <FormControl id="SeminarNew_formcontrol">
                            <InputLabel>Beskrivelse</InputLabel>
                            <Input id="SeminarNew_input_desc" required={true} value={this.state.SeminarNew_input_desc} onKeyUp={this.onSubmit} onChange={this.onInputChange} variant="filled" multiline rowsMax="10" />
                        </FormControl>
                        {this.state.SeminarNew_input_imageprev !== "" &&
                            <>
                            <img id="SeminarNew_input_imageprev" src={URL.createObjectURL(this.state.SeminarNew_input_imageprev)}/>
                            <IconButton id="SeminarNew_iconbutton_remove" onClick={this.onImageChange} color="primary" component="span">
                                <HighlightOffIcon />{"Slett bildet"}
                            </IconButton>
                            </>
                        }
                        {this.state.SeminarNew_input_imageprev == "" &&
                            <>
                            <p id="SeminarNew_p_noimage"><i>Ikke noe bilde valgt</i></p>
                            <input
                                accept="image/png, image/jpeg"
                                id="SeminarNew_input_image"
                                onChange={this.onImageChange}
                                type="file"
                                value={this.state.SeminarNew_input_image}
                                hidden
                            />
                            <label htmlFor="SeminarNew_input_image">
                                <IconButton id="SeminarNew_iconbutton_select" color="primary" component="span">
                                    <ImageOutlinedIcon />{"Velg et bilde"}
                                </IconButton>
                            </label>
                            </>
                        }
                        <Button type="submit" disabled={this.state.submitDisabled} style={{opacity: this.state.submitOpacity}} variant="contained">{this.state.submitText}</Button>
                    </form>
                </main>
                </>
            );
        } else {
            return (
                // Bruker er ikke innlogget, går til forsiden
                <Redirect to={{pathname: "/"}} />
            );
        }
    }
}

export default SeminarNew;
