# Brukerveiledning åpent API for FHI Statistikk

## Beskrivelse/Innledning
Skal vi kort beskrive alle endepunkter eller kun de som trengs for å hente data?

## Swagger
[Se Swagger dokumentasjon](link)

## Flyt for å hente data
(Hvilke metoder trengs)
### Hent kilder
Endepunktet `/api/open/v1/Common/source` kan brukes for å liste opp ulike kilder. 

Id i responson fra dette endepunktet brukes som SourceId i alle andre endepunkter i API'et.
### Hent tabeller
Endepunktet `/api/open/v1/{SourceId}/table` kan brukes for å liste opp de ulike tabellene for en kilde. Det er også mulig å legge inn et filter modifiedAfter for å liste opp de 
tabellene som er oppdatert etter en gitt tid.

TableId i responsen fra dette endepunktet brukes sammen med SourceId i de andre endepunktene i API'et.
### Hent spørring
Endepunktet `/api/open/v1/{SourceId}/Table/{TableId}/query` kan brukes for å hente ut en spørring for å hente ut data. Responsen fra dette endepunktet kan kopieres og brukes som
request body i endepunktet for å hente data. 
### Hent data
Endepunktet `/api/open/v1/{SourceId}/Table/{TableId}/data` kan brukes for å hente selve dataene for en tabell. 
#### Filter
##### Item
##### Top
##### All
#### Respons formater
##### json-stat2
Returnerer json objekt[Beskrivelse av JSON-stat standarden](https://json-stat.org/format/)
Responsen fra spørringer i dette formatet kan limes inn i [JSON-stat explorer](http://jsonstat.com/explorer/) for å se på dataene i et lesevennlig format.
##### csv2
Returnerer csv-fil med lesbare etiketter for dimensjoner og måltall.
##### csv3
Returnerer csv-fil med koder for dimensjoner og måltall.


## Metadata
Skal vi ta med dette?
## Spesialtegn/Flagging
Skal vi ta med dette?

## Feilmeldinger
