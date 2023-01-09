# User manual FHI Statistikk Open API

## Introduction
FHI Statistikk Open API offer endpoints to get data for sources that has published their data using the FHI Statistikk. Example sources ...

## Swagger
The API is documented in [Swagger](link). This page can also be used to get from the API.

## Endpoints
### Get sources
The endpoint `/api/open/v1/Common/source` can be used to get a list of the different sources. 

Id in the response from this endpoint is used as SourceId parameter in all other endpoints in the API.
### Get tables
The endpoint `/api/open/v1/{SourceId}/table` can be used to get a list of published tables from a source. An optional parameter, modifiedAfter, can be used to only list tables modified after a certain datetime.

TableId in the  response from this endpoint is used together with SourceId in all the endpoints described below.
### Get table
The endpoint `/api/open/v1/{SourceId}/table/{tableId}` can be used to get information about a specific table.

The format of the response is the same as for the endpoint 'Get tables'.
### Get query
The endpoint `/api/open/v1/{SourceId}/Table/{tableId}/query` kan brukes for å hente ut en spørring for å hente ut data. Responsen fra dette endepunktet vil returnere en spørring i JSON-format som 
inneholder alle kategorier for alle dimensjoner og alle måltall. Hvert filtervalg kalles en dimensjon og verdiene en dimensjon kan ha, kalles kategorier. Eksempler på dimensjoner kan være "AAR" 
for årstall og "GEO" for geografi og kategorier kan for årstall være for eksempel "2020" eller "2021". Måltall vil listes som dimensjon "MEASURE_TYPE" der hvert enkelt måltall er en kategori.

Responsen fra dette endepunktet kan kopieres og brukes som request body i endepunktet for å hente data. 
### Hent dimensjoner
Endepunktet `/api/open/v1/{SourceId}/Table/{tableId}/dimension` kan brukes for å hente ut informasjon om alle dimensjoner og tilhørende kategorier for en tabell. 

Responsen her vil være informasjon i JSON-format som i tillegg til informasjonen som returneres når en henter en spørring, inneholde etikett/label for alle dimensjoner og kategorier.
### Hent data
Endepunktet `/api/open/v1/{SourceId}/Table/{tableId}/data` kan brukes for å hente verdier for måltall for en tabell. Her må det sendes inn en request body i JSON-format der hver dimensjon i 
tabellen må spesifiseres med et filter. 

Et eksempel på request body som viser formatet er: 
```json
{
  "dimensions": [
    {
      "code": "AAR",
      "filter": "item",
      "values": [
        "2020",
        "2021"
      ]
    },
    {
      "code": "INDIKATOR",
      "filter": "all",
      "values": [
        "A*",
        "B*"
      ]
    },
    {
      "code": "GEO",
      "filter": "top",
      "values": [
        "2"
      ]
    },
    {
      "code": "MEASURE_TYPE",
      "filter": "item",
      "values": [
        "TELLER",
        "RATE"
      ]
    }
  ],
  "response": {
    "format": "json-stat2"
  }
}
```

#### Filter
De ulike filter som støttes er "item", "top" og "all". For hver dimensjon må velge en og kun en filtertype, men en bruke ulike typer filter på de ulike dimensjonene. Dimensjonen for måltall, 
"MEASURE_TYPE" støtter de samme filtertyper som for andre dimensjoner.
##### Item
Her må en spesifisere eksakt hvilke kategorier en ønsker å hente data for. En må velge minst en kategori, men en kan liste opp så mange kategorier en ønsker.
##### Top
Her spesifiserer en hvor mange kategorier en ønsker å hente data for ved å legge inn et heltall som er 1 eller større. Det vil da hentes data for så mange kategorier som en spesifiserer som verdi.
##### All
Her kan en spesifisere filter med jokertegn '*'. En kan liste opp flere filterverdier, der for eksempel `["A*","B*"]` vil gi alle kategorier som begynner på 'A' eller 'B'. Ved å bruke kun `["*"]`,
vil alle kategorier velges.
#### Respons formater
##### json-stat2
Returnerer json objekt som følger JSON-stat standarden. [JSON-stat](https://json-stat.org/format/) standarden er et format for vise statistiske tabeller. 
Responsen fra spørringer i dette formatet kan limes inn i [JSON-stat explorer](http://jsonstat.com/explorer/) for å se på dataene i et lesevennlig format.
##### csv2
Returnerer csv-fil med lesbare etiketter for dimensjoner og måltall.
##### csv3
Returnerer csv-fil med koder for dimensjoner og måltall.
### Spesialtegn/Flagging
Endepunktet `/api/open/v1/{SourceId}/Table/{tableId}/flag` kan brukes for å hente ut informasjon om spesialtegn eller flagg som brukes for de kombinasjonene kategorier der måltallet ikke kan vises.
Typiske årsaker til at verdier flagges, kan være manglende data, at verdien ikke lar seg beregne eller at verdien er skjult av personvernhensyn.
Responsen her vil være informasjon i JSON-format som i tillegg til informasjonen som returneres når en henter en spørring, inneholde etikett/label for alle dimensjoner og kategorier.
### Metadata
Endepunktet `/api/open/v1/{SourceId}/Table/{tableId}/metadata` kan brukes for å hente ut metadata for tabellen. Responsen inneholder en liste over seksjoner med metadata. 
Hver seksjon inneholder en overskrift og en innholdsdel. Det vil være seksjoner som er lagt inn av redaktøren for kilden for å beskrive innholdet i tabellen samt seksjoner som gir oversikt over de 
ulike dimensjonene og tilhørende kategorier.
### Sist oppdatert
Endepunktet `/api/open/v1/{SourceId}/Table/{tableId}/metadata/lastUpdated` kan brukes for å hente ut tidspunkt for siste oppdatering av tabellen.
## Returkoder/Feilmeldinger
### 200 Ok
Returkode 200 indikerer at kallet er utført med suksess.

### 400 Bad Request
Returkode 400 returneres om det er feil i syntaksen i spørringen. Mer detaljer om feilen vil returneres i status-feltet i responsen.

### 404 Not Found
Returkode 404 returneres om det spørres etter data som ikke finnes. Mer detaljer om feilen vil returneres i status-feltet i responsen.