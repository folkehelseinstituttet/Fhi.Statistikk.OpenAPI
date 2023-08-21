import { Component, OnInit } from '@angular/core';
import { OpenApiService } from './open-api.service';
import { SourceInfo } from './models/sourceInfo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'openApiClient';
  sourceId = 'nokkel';
  tableId = 2;
  data: any;
  sources: SourceInfo[] | undefined
  tables: any;
  metadata: any;
  dimensions: any;
  flags: any;

  constructor(
    private openApiService: OpenApiService,
  ) {}

  ngOnInit(): void {
    this.openApiService.getSources().subscribe((sourceInfo) => this.sources = sourceInfo)
    // this.openApiService.getTables(this.sourceId).subscribe((tables) => this.tables = tables)
    // this.openApiService.getMetadata(this.sourceId, this.tableId).subscribe((metadata) => this.metadata = metadata)
    // this.openApiService.getDimensions(this.sourceId, this.tableId).subscribe((dimensions) => this.dimensions = dimensions)
    // this.openApiService.getFlags(this.sourceId, this.tableId).subscribe((flags) => this.flags = flags)
    // this.openApiService.getQuery(this.sourceId, this.tableId).subscribe((query) => {
    //   this.openApiService.getData(this.sourceId, this.tableId, query).subscribe((data) => this.data = data)
    // })
  }

}
