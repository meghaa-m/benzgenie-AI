import 'package:flutter/material';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/store.dart';
import '../models/types.dart';

class DocumentsScreen extends StatefulWidget {
  const DocumentsScreen({Key? key}) : super(key: key);

  @override
  _DocumentsScreenState createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends State<DocumentsScreen> {
  bool _isUploading = false;
  String? _uploadingName;
  DocumentRecord? _activeSummaryDoc;

  @override
  Widget build(BuildContext context) {
    final store = Provider.of<BizGenieStore>(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Text(
            "Doc Intelligence & OCR",
            style: GoogleFonts.spaceGrotesk(
              fontSize: 22.0,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            "Ingest PDF audits, parse agreement terms, and synthesize business insights with local OCR.",
            style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFF64748B)),
          ),
          const SizedBox(height: 24.0),

          // Upload Box area
          GestureDetector(
            onTap: _simulateUpload,
            child: Container(
              padding: const EdgeInsets.all(32.0),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(24.0),
                border: Border.all(color: const Color(0xFF1E293B), style: BorderStyle.solid),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: const BoxDecoration(
                      color: Color(0x1A818CF8),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.cloud_upload, color: Color(0xFF818CF8), size: 32.0),
                  ),
                  const SizedBox(height: 16.0),
                  Text(
                    "Upload Financials or Agreements",
                    style: GoogleFonts.spaceGrotesk(fontSize: 15.0, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 4.0),
                  Text(
                    "Supports PDF, DOCX, XLSX, PNG, JPG (Max 15MB)",
                    style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B)),
                  ),
                  if (_isUploading) ...[
                    const SizedBox(height: 20.0),
                    Text(
                      "OCR Engine is extracting text from \"$_uploadingName\"...",
                      style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFFA78BFA), fontStyle: FontStyle.italic),
                    ),
                    const SizedBox(height: 10.0),
                    const ClipRRect(
                      borderRadius: BorderRadius.all(Radius.circular(4.0)),
                      child: LinearProgressIndicator(color: Color(0xFF7C3AED), backgroundColor: Color(0xFF020617)),
                    )
                  ]
                ],
              ),
            ),
          ),
          const SizedBox(height: 24.0),

          // Ingested Documents list
          _buildCardFrame(
            title: "Ingested Documents & Summaries",
            icon: Icons.folder_copy,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: store.documents.length,
                  separatorBuilder: (context, idx) => const Divider(color: Color(0xFF1E293B)),
                  itemBuilder: (context, idx) {
                    final doc = store.documents[idx];
                    bool isActive = _activeSummaryDoc?.id == doc.id;

                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: Icon(
                        doc.type == 'pdf'
                            ? Icons.picture_as_pdf
                            : doc.type == 'docx'
                                ? Icons.description
                                : Icons.image,
                        color: doc.type == 'pdf' ? const Color(0xFFEF4444) : const Color(0xFF3B82F6),
                      ),
                      title: Text(doc.name, style: GoogleFonts.inter(fontSize: 13.0, fontWeight: FontWeight.bold, color: Colors.white)),
                      subtitle: Text("Uploaded: ${doc.uploadDate} • Size: ${doc.size}", style: GoogleFonts.inter(fontSize: 11.0, color: const Color(0xFF64748B))),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: Icon(isActive ? Icons.visibility_off : Icons.visibility, color: const Color(0xFF818CF8), size: 18.0),
                            onPressed: () {
                              setState(() {
                                _activeSummaryDoc = isActive ? null : doc;
                              });
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete, color: Colors.roseColor, size: 16.0),
                            onPressed: () => store.deleteDocument(doc.id),
                          )
                        ],
                      ),
                    );
                  },
                ),
                if (_activeSummaryDoc != null) ...[
                  const Divider(color: Color(0xFF1E293B), height: 32.0),
                  Container(
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFF020617),
                      borderRadius: BorderRadius.circular(16.0),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "Document Overview: ${_activeSummaryDoc!.name}",
                              style: GoogleFonts.spaceGrotesk(fontSize: 13.0, fontWeight: FontWeight.bold, color: const Color(0xFFA78BFA)),
                            ),
                            IconButton(
                              icon: const Icon(Icons.close, color: Color(0xFF64748B), size: 16.0),
                              onPressed: () => setState(() => _activeSummaryDoc = null),
                            )
                          ],
                        ),
                        const SizedBox(height: 8.0),
                        Text(
                          _activeSummaryDoc!.summary ?? "Summary not compiled yet.",
                          style: GoogleFonts.inter(fontSize: 12.0, color: const Color(0xFFE2E8F0), height: 1.4),
                        ),
                      ],
                    ),
                  )
                ]
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCardFrame({required String title, required IconData icon, required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Icon(icon, color: const Color(0xFF818CF8), size: 18.0),
              const SizedBox(width: 8.0),
              Text(
                title,
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 15.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const Divider(color: Color(0xFF1E293B), height: 20.0),
          child,
        ],
      ),
    );
  }

  void _simulateUpload() {
    if (_isUploading) return;

    setState(() {
      _isUploading = true;
      _uploadingName = "AWS_Platform_Contract_July2026.pdf";
    });

    Future.delayed(const Duration(seconds: 2), () {
      final store = Provider.of<BizGenieStore>(context, listen: false);
      store.addDocument(DocumentRecord(
        id: "doc-${DateTime.now().millisecondsSinceEpoch}",
        name: _uploadingName!,
        type: 'pdf',
        size: '1.4 MB',
        uploadDate: DateTime.now().toIso8601String().split('T')[0],
        status: 'completed',
        summary: 'Agreement parsed successfully. Contains cloud nodes scalability contracts for Zenith Tech Solutions covering 24 months, starting July 2026. Includes Net 30 billing clauses.',
      ));

      setState(() {
        _isUploading = false;
        _uploadingName = null;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Document uploaded and scanned successfully with OCR!")),
      );
    });
  }
}

extension on Colors {
  static const Color roseColor = Color(0xFFF43F5E);
}
