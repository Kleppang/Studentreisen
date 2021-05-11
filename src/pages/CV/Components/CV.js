import '../Styles/CV.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CookieService from '../../../global/Services/CookieService';
import Loader from '../../../global/Components/Loader';
import NoAccess from '../../../global/Components/NoAccess';
import CardContent from '@material-ui/core/CardContent';
import Box from'@material-ui/core/Box';
import Grid from'@material-ui/core/Grid';
import moment from 'moment';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

function CV(props) {

    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(false);

    const token = CookieService.get("authtoken");

    // Hente brukernavn og profilbilde
    const [fnavn, setFnavn] = useState("");
    const [enavn, setEnavn] = useState("");
    const [tlf, setTlf] = useState();
    const [email, setEmail] = useState();
    const [profilbilde, setProfilbilde] = useState();
    
    // Oppretting av arrays for CV
    const [utdanning, setUtdanning] = useState([[-1, -1]]);
    const [seminar, setSeminar] = useState([[-1,-1]]);
    const [jobb, setJobb] = useState([[-1, -1]]);
    const [annet, setAnnet] = useState([[-1, -1]])

    // Oppretting av CV Innlegg
    const [valgt_type, setValgt_type] = useState("");
    const [opprett_innlegg, setOpprett_innlegg] = useState("");
    const [opprett_datoFra, setOpprett_datoFra] = useState("");
    const [opprett_datoTil, setOpprett_datoTil] = useState("");

    const useStyles = makeStyles ({
        avatar: {
            width: '10vh',
            height: '10vh',
        },
        grid: {
            backgroundColor: 'white'
            },
    });

    const classes = useStyles();

//    const [profilbilde, setProfilbilde] = useState();
    const fetch = () => {
        // Authtoken sendes ved for å hente pålogget brukers ID
        const config = {
            token: token
        }
        axios
            // Flere spørringer kjøres samtidig, vent til ALLE er ferdige
            .all([
                axios.post(process.env.REACT_APP_APIURL + "/cv/getBruker", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getBrukerbilde", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getCVEducation", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getCVSeminar", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getCVWork", config),
                axios.post(process.env.REACT_APP_APIURL + "/cv/getCVOther", config)
            ])
            // Alle spørringer gjennomført
            .then(axios.spread((res1, res2, res3, res4, res5, res6) => {
                setFnavn(res1.data.results[0].fnavn);
                setEnavn(res1.data.results[0].enavn);
                setTlf(res1.data.results[0].telefon);
                setEmail(res1.data.results[0].email);
                if (res2.data.results !== undefined) {
                    setProfilbilde(res2.data.results[0].plassering)}
                if (res3.data !== undefined) {    
                    setUtdanning(res3.data.results);}
                if (res3.data !== undefined) {      
                    setSeminar(res4.data.results);}
                if (res3.data !== undefined) {      
                    setJobb(res5.data.results);}
                if (res3.data !== undefined) {      
                    setAnnet(res6.data.results);}
                // Data er ferdig hentet fra server
                setLoading(false);
            }))
    }

    const [slettopenEducation, setSlettopenEducation] = useState(false);
    const [slettopenSeminar, setSlettopenSeminar] = useState(false);
    const [slettopenWork, setSlettopenWork] = useState(false);
    const [slettopenOther, setSlettopenOther] = useState(false);
    const [opprettopen, setOpprettopen] = useState(false);

    const handleCloseOpprettInnlegg = () => {
        setOpprettopen(false);
        const config ={
            token: token,
            opprett_cv_innlegg: opprett_innlegg,
            opprettdatoFra: opprett_datoFra,
            opprettdatoTil: opprett_datoTil
        }
        console.log(valgt_type)
        if (valgt_type === "Seminar") {
            axios.post(process.env.REACT_APP_APIURL + "/cv/postCVSeminar", config)
            window.location.reload();
        }
        if (valgt_type === "Utdanning") {
            axios.post(process.env.REACT_APP_APIURL + "/cv/postCVEducation", config)
            window.location.reload();
        }
        if (valgt_type === "Jobberfaring") {
            axios.post(process.env.REACT_APP_APIURL + "/cv/postCVWork", config)
            window.location.reload();
        }
        if (valgt_type === "Annet") {
            axios.post(process.env.REACT_APP_APIURL + "/cv/postCVOther", config)
            window.location.reload();
        }
      };

    const handleClickOpenOpprett =() => {
        setOpprettopen(true);
      };

    const handleCloseOpprett = () => {
        setOpprettopen(false);
      };

    const handleClickOpenSlettEducation = () => {
        setSlettopenEducation(true);
      };

    const handleClickOpenSlettSeminar = () => {
        setSlettopenSeminar(true);
      };

    const handleClickOpenSlettWork = () => {
        setSlettopenWork(true);
      };

    const handleClickOpenSlettOther = () => {
        setSlettopenOther(true);
      };
    
    const handleCloseSlett = () => {
        setSlettopenEducation(false);
        setSlettopenSeminar(false);
        setSlettopenWork(false);
        setSlettopenOther(false);
      };

    const handleCloseSlettInnleggSem = (cv_id) => {
        setSlettopenSeminar(false);
        console.log(cv_id + "Sem")
        const config = {
            token: token,
            cv_seminar_id: cv_id           
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/slettInnleggSem", config).then(() => {
            window.location.reload();
        })
      };

    const handleCloseSlettInnleggEdu = (id) => {
        setSlettopenEducation(false);
        console.log(id + "Edu")
        const config = {
            token: token,
            cv_education_id: id           
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/slettInnleggEdu", config).then(() => {
            window.location.reload();
        })
      };

    const handleCloseSlettInnleggWork = (cv_id) => {
        setSlettopenWork(false);
        console.log(cv_id + "Work")
        const config = {
            token: token,
            cv_work_id: cv_id           
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/slettInnleggWork", config).then(() => {
            window.location.reload();
        })
      };

    const handleCloseSlettInnleggOther = (id) => {
        setSlettopenOther(false);
        console.log(id + "Other")
        const config = {
            token: token,
            cv_other_id: id           
        }
        axios.post(process.env.REACT_APP_APIURL + "/cv/slettInnleggOther", config).then(() => {
            window.location.reload();
        })
      };
    
      useEffect( () => {
        setAuth(props.auth)
        fetch();
    }, [props]);
    
    const handleOpprettInnlegg = (event) => {
        setOpprett_innlegg(event.target.value);
    }

    if (loading) {
        return (
            <section id="loading">
                <Loader />
            </section>
        )
    } 

    if (auth && !loading) {
        return (  
            <div id="main_cv">
                <Grid id="gridbox" className={classes.grid} 
                p={2}
                alignItems="center"
                justify="center"
                container
                width="75%" >
                    <Avatar
                        src={"/uploaded/" + profilbilde } 
                        className={classes.avatar}
                        p={2}
                        style={{alignSelf: 'center'
                    }}
                    />
                    <Box alignItems="center">
                        <p>{"Navn: " + fnavn + " " + enavn} </p>
                        <p>{"Epost: " + email}</p>
                        <p>{"Telefonnummer: " + tlf}</p>
                    </Box>
                </Grid>


                <Grid className={classes.grid}>
                    <Button id="innleggButton" variant="contained" size="large" color="primary" className={classes.margin} onClick={handleClickOpenOpprett}>
                        Opprett nytt innlegg
                    </Button>
                    <Dialog open={opprettopen} onClose={handleCloseOpprett} aria-labelledby="form-dialog-title">
                        <DialogTitle id="cv_dialog_title">Legg til på CV</DialogTitle>
                        <DialogContent>
                            <Select onChange={(e) => setValgt_type(e.target.value)} required>
                                <MenuItem value={"Seminar"}>Seminar</MenuItem>
                                <MenuItem value={"Utdanning"}>Utdanning</MenuItem>
                                <MenuItem value={"Jobberfaring"}>Jobberfaring</MenuItem>
                                <MenuItem value={"Annet"}>Annet</MenuItem>
                            </Select>

                            <Input value={opprett_innlegg}
                                    onChange={handleOpprettInnlegg} required>
                                        Skriv inn innlegg her
                            </Input>

                            <Input
                            id="date"
                            label="datoFra"
                            type="date"
                            value={opprett_datoFra}
                            onChange={(e) => setOpprett_datoFra(e.target.value)}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            />
                            <Input
                            id="date"
                            label="datoTil"
                            type="date"
                            value={opprett_datoTil}
                            onChange={(e) => setOpprett_datoTil(e.target.value)}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleCloseOpprett} color="primary">
                            Avbryt
                        </Button>
                        <Button onClick={() => {handleCloseOpprettInnlegg()}} color="primary" autoFocus>
                            Opprett
                        </Button>
                        </DialogActions>
                    </Dialog>
                    <CardContent>                    
                        <Box boxShadow={1}>
                            <h1>Utdannelse</h1>
                            {utdanning !== undefined && utdanning.map((utd, indexEdu) => (
                                <div className="cv_returned_content">
                                    {utd.datoFra !== null &&
                                    <text className='cv_returned_datoTil' type="date">Fra: {moment.locale('nb'), moment(utd.datoFra).format("DD MMM YYYY")}</text>}
                                    {utd.datoTil !== null && 
                                    <text className='cv_returned_datoFra' type="date">Til: {moment.locale('nb'), moment(utd.datoTil).format("DD MMM YYYY")}</text>}
                                    <p className='cv_returned_innlegg'>{utd.innlegg}</p>
                                    <Button
                                    type="submit"
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                    key={indexEdu}
                                    onClick={handleClickOpenSlettEducation}
                                    >
                                    Slett Edu
                                    </Button>
                                    <Dialog open={slettopenEducation} onClose={handleCloseSlett} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Slette innlegget?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Er du sikker på at du ønsker å slette innlegget?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseSlett} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button value={utd.cv_education_id} onClick={() => {handleCloseSlettInnleggEdu(utd.cv_education_id)}} color="primary" autoFocus>
                                            Slett
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            ))}
                            {utdanning === undefined &&
                                <div>
                                    <p>Ingen informasjon her enda.</p>
                                </div>}
                        </Box>
                        <Box boxShadow={1}>
                            <h1>Seminarer og sertifiseringer</h1>
                            {seminar !== undefined && seminar.map((sem, indexSem) => (
                                <div className="cv_returned_content">
                                    {sem.datoFra !== null && 
                                    <text className='cv_returned' type="date">Fra: {moment.locale('nb'), moment(sem.datoFra).format("DD MMM YYYY")}</text>}
                                    {sem.datoTil !== null && 
                                    <text className='cv_returned' type="date">Til: {moment.locale('nb'), moment(sem.datoTil).format("DD MMM YYYY")}</text>}
                                    <p className='cv_returned'>{sem.innlegg}</p>
                                    <Button
                                    type="submit"
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                    key={indexSem}
                                    onClick={handleClickOpenSlettSeminar}
                                    >
                                    Slett Sem
                                    </Button>
                                    <Dialog open={slettopenSeminar} onClose={handleCloseSlett} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Slette innlegget?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Er du sikker på at du ønsker å slette innlegget?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseSlett} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button value={sem.cv_seminar_id} onClick={() => {handleCloseSlettInnleggSem(sem.cv_seminar_id)}} color="primary" autoFocus>
                                            Slett
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            ))}
                            {seminar === undefined &&
                                <div>
                                    <p>Ingen informasjon her enda.</p>
                                </div>}
                        </Box>
                        <Box boxShadow={1}>
                            <h1>Jobberfaring</h1>
                            {jobb !== undefined && jobb.map((wor, indexWor) => (
                                <div className="cv_returned_content">
                                    {wor.datoFra !== null && 
                                    <text className='cv_returned' type="date">{moment.locale('nb'), moment(wor.datoFra).format("DD MMM YYYY")}</text>}
                                    {wor.datoTil !== null && 
                                    <text className='cv_returned' type="date">{moment.locale('nb'), moment(wor.datoTil).format("DD MMM YYYY")}</text>}
                                    <p className='cv_returned'>{wor.innlegg}</p>
                                    <Button
                                    type="submit"
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                    key={indexWor}
                                    onClick={handleClickOpenSlettWork}
                                    >
                                    Slett Work
                                    </Button>
                                    <Dialog open={slettopenWork} onClose={handleCloseSlett} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Slette innlegget?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Er du sikker på at du ønsker å slette innlegget?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseSlett} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button value={wor.cv_work_id} onClick={() => {handleCloseSlettInnleggWork(wor.cv_work_id)}} color="primary" autoFocus>
                                            Slett
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                                ))}
                                {jobb === undefined &&
                                <div>
                                    <p>Ingen informasjon her enda.</p>
                                </div>}
                        </Box>
                        <Box boxShadow={1}>
                        <h1>Annet</h1>
                            {annet !== undefined && annet.map((ann, indexAnn) => (
                                <div className="cv_returned_content">
                                    {ann.datoFra !== null && 
                                    <text className='cv_returned' type="date">{moment.locale('nb'), moment(ann.datoFra).format("DD MMM YYYY")}</text>}
                                    {ann.datoTil !== null && 
                                    <text className='cv_returned' type="date">{moment.locale('nb'), moment(ann.datoTil).format("DD MMM YYYY")}</text>}
                                    <p className='cv_returned'>{ann.innlegg}</p>

                                                                        <Button
                                    type="submit"
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                    key={indexAnn}
                                    onClick={handleClickOpenSlettOther}
                                    >
                                    Slett Other
                                    </Button>
                                    <Dialog open={slettopenOther} onClose={handleCloseSlett} aria-labelledby="form-dialog-title">
                                        <DialogTitle id="cv_dialog_title">Slette innlegget?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Er du sikker på at du ønsker å slette innlegget?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={handleCloseSlett} color="primary">
                                            Avbryt
                                        </Button>
                                        <Button value={ann.cv_other_id} onClick={() => {handleCloseSlettInnleggOther(ann.cv_other_id)}} color="primary" autoFocus>
                                            Slett
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                                ))}
                                {annet === undefined &&
                                <div>
                                    <p>Ingen informasjon her enda.</p>
                                </div>}
                        </Box>
                    </CardContent>
                </Grid>
            </div>                  
         );
        } else {
            return (
                // Ugyldig eller ikke-eksisterende token 
                <NoAccess />
            );
        }
    }


export default CV;