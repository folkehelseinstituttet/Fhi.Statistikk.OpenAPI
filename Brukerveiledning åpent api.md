# Brukerveiledning Åpent API for FHI Statistikk

## Beskrivelse/Innledning
Åpent API for FHI Statistikk tilbyr ulike endepunkter for å hente ut data for de kildene som har lagt sine data ut i FHI Statistikk. Eksempler på kilder...

## Swagger
API'et er dokumentert i [Swagger](link). Denne siden kan også brukes til å hente ut data fra API'et.

## Beskrivelse av endepunkter
### Hent kilder
Endepunktet `/api/open/v1/Common/source` kan brukes for å liste opp ulike kilder. 

Id i responson fra dette endepunktet brukes som SourceId i alle andre endepunkter i API'et.
### Hent tabeller
Endepunktet `/api/open/v1/{SourceId}/table` kan brukes for å liste opp de ulike tabellene for en kilde. Det er også mulig å legge inn et filter modifiedAfter for å liste opp de 
tabellene som er oppdatert etter en gitt tid.

TableId i responsen fra dette endepunktet brukes sammen med SourceId i de andre endepunktene i API'et.
### Hent tabell
Endepunktet `/api/open/v1/{SourceId}/table/{tableId}` kan brukes for å hente informasjon om en enkelt tabell.

Formatet på responsen er det samme som når en bruker endepunktet 'Hent tabeller'.
### Hent spørring
Endepunktet `/api/open/v1/{SourceId}/Table/{TableId}/query` kan brukes for å hente ut en spørring for å hente ut data. Responsen fra dette endepunktet vil returnere en spørring i JSON-format som 
inneholder alle kategorier for alle dimensjoner og alle måltall. Hvert filtervalg kalles en dimensjon og verdiene en dimensjon kan ha, kalles kategorier. Eksempler på dimensjoner kan være "AAR" 
for årstall og "GEO" for geografi og kategorier kan for årstall være for eksempel "2020" eller "2021". Måltall vil listes som dimensjon "MEASURE_TYPE" der hvert enkelt måltall er en kategori.

Responsen fra dette endepunktet kan kopieres og brukes som request body i endepunktet for å hente data. 
### Hent dimensjoner
Endepunktet `/api/open/v1/{SourceId}/Table/{TableId}/dimension` kan brukes for å hente ut informasjon om alle dimensjoner og tilhørende kategorier for en tabell. 

Responsen her vil være informasjon i JSON-format som i tillegg til informasjonen som returneres når en henter en spørring, inneholde etikett/label for alle dimensjoner og kategorier.
### Hent data
Endepunktet `/api/open/v1/{SourceId}/Table/{TableId}/data` kan brukes for å hente verdier for måltall for en tabell. Her må det sendes inn en request body i JSON-format der hver dimensjon i 
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
